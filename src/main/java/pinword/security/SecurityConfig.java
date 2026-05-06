package pinword.security;

import lombok.RequiredArgsConstructor; // 👈 추가
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.Customizer;

/**
 * [Spring Security 설정 클래스]
 * * 아키텍트의 시선:
 * 애플리케이션의 전체적인 문단속을 책임집니다.
 * JWT를 사용하기 때문에 불필요한 기본 보안 설정(세션, CSRF 등)은 끄고, 
 * 무상태(Stateless) 아키텍처를 유지하도록 설계했습니다.
 */
@Configuration // 스프링에게 "이 클래스는 설정 파일이야!" 라고 알려줍니다.
@EnableWebSecurity // 스프링 시큐리티의 웹 보안 기능을 활성화합니다.
@RequiredArgsConstructor // 👈 [추가 1] Lombok 어노테이션 추가 (JwtFilter를 조립하기 위함)
public class SecurityConfig {

    private final JwtFilter jwtFilter; // 👈 [추가 2] 방금 만든 경비원을 불러옵니다.

    // [비밀번호 암호화 도구]
    // 유저가 회원가입할 때 입력한 비밀번호를 안전한 해시(Hash)로 바꿔주는 역할을 합니다.
    // @Bean으로 등록해두면, 나중에 필요한 곳에서 스프링이 알아서 꺼내줍니다.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // [보안 규칙 (필터 체인) 설정]
    // 누가 어떤 API에 접근할 수 있는지 문지기 역할을 합니다.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // 💡 [추가] CORS 설정을 활성화합니다!
            // 1. REST API 서버이므로 화면(View)에서 오는 해킹 공격(CSRF) 방어 기능은 끕니다.
            .csrf(csrf -> csrf.disable()) 
            
            // 2. 우리는 서버에 정보를 저장하는 '세션' 대신, 방문증인 'JWT'를 쓸 것이므로 세션을 끕니다. (무상태성 보장)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
            
            // 3. API 주소별로 접근 권한을 설정합니다.
            .authorizeHttpRequests(auth -> auth
                // 로그인, 회원가입 API("/api/auth/...")는 누구나 접근 가능해야 합니다. (permitAll)
                .requestMatchers("/api/auth/**").permitAll() 
                // 관리자 API("/api/admin/...")는 "ADMIN" 권한을 가진 방문증(토큰)만 접근 가능합니다.
                .requestMatchers("/api/admin/**").hasRole("ADMIN") 
                // 그 외에 나머지 모든 API는 일단 로그인(방문증 발급)을 한 사람만 쓸 수 있습니다.
                .requestMatchers("/api/words", "/api/quiz").hasAnyRole("USER", "ADMIN")
                // 조회와 퀴즈는 누구나 접근할 수 있습니다.
                .anyRequest().authenticated() 
            )
            // 👈 [추가 3] 스프링의 기본 인증 절차 전에 우리가 만든 JwtFilter(경비원)가 먼저 토큰을 검사하도록 배치합니다.
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build(); // 설정한 규칙을 조립해서 문지기(필터)로 만듭니다.
    }
}