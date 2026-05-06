// src/main/java/pinword/security/JwtFilter.java
package pinword.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * [JWT 검증 필터 (경비원)]
 * 클라이언트가 보낸 요청의 헤더에서 토큰을 꺼내어 유효한지 검사하고,
 * 유효하다면 스프링 시큐리티에게 "이 유저는 인증되었고, 권한은 이거야!" 라고 알려줍니다.
 */
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 'Authorization' 이라는 이름의 택배(토큰)를 꺼냅니다.
        String header = request.getHeader("Authorization");

        // 2. 토큰이 존재하고, "Bearer "로 시작하는 규격을 지켰는지 확인합니다.
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // "Bearer " 글자를 떼어내고 순수 토큰만 남깁니다.

            try {
                // 3. 방문증(토큰)에서 유저 번호와 권한을 읽어냅니다.
                Long userId = Long.parseLong(jwtUtil.extractUserId(token));
                String role = jwtUtil.extractRole(token); // 예: "ROLE_ADMIN"

                // 4. 스프링 시큐리티의 '인증 완료 도장'을 만듭니다.
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userId, null, List.of(new SimpleGrantedAuthority(role))
                );

                // 5. 통제 센터(SecurityContext)에 인증 완료 도장을 쾅! 찍어줍니다.
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                // 토큰이 만료되었거나 가짜라면 여기서 에러가 나고, 인증 도장을 못 받아서 403 에러가 납니다.
                System.out.println("토큰 검증 실패: " + e.getMessage());
            }
        }

        // 6. 다음 목적지(컨트롤러)로 요청을 그대로 통과시킵니다.
        filterChain.doFilter(request, response);
    }
}