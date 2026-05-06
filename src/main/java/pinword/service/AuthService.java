package pinword.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pinword.dto.AuthDto;
import pinword.entity.User;
import pinword.repository.UserRepository;
import pinword.security.JwtUtil;

/**
 * [인증 서비스 클래스]
 * * 아키텍트의 시선:
 * 컨트롤러(창구)가 요청을 받아오면, 여기서 데이터베이스(UserRepository)와 보안 도구(JwtUtil, PasswordEncoder)를
 * 조립해서 실제 로그인/회원가입 '업무'를 처리합니다. (높은 응집도)
 */
@Service // 스프링에게 "이 클래스는 비즈니스 로직을 처리하는 서비스야!" 라고 알려줍니다.
@RequiredArgsConstructor // final이 붙은 도구들을 스프링이 알아서 조립(주입)해 주게 만드는 마법의 롬복 어노테이션입니다.
public class AuthService {

    // 우리가 사용할 3가지 도구 (낮은 결합도를 위해 인터페이스/유틸리티로 의존성을 주입받음)
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // [업무 1] 회원가입 로직
    @Transactional // 도중에 에러가 나면 DB에 저장되던 걸 없던 일(롤백)로 만들어주는 안전장치
    public void registerUser(AuthDto.SignupRequest request) {
        // 1. 이메일 중복 체크 (이미 가입된 이메일이면 에러 발생)
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2. 비밀번호 암호화 (사용자가 입력한 "1234"를 복잡한 해시로 변환)
        String encodedPassword = passwordEncoder.encode(request.password());

        // 3. 새로운 유저 객체(Entity) 생성 및 데이터 채우기
        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setPassword(encodedPassword);
        newUser.setName(request.name());
        newUser.setRole("ROLE_USER"); // 기본 권한 부여

        // 4. 데이터베이스에 저장!
        userRepository.save(newUser);
    }

    // [업무 2] 로그인 로직
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        // 1. 이메일로 유저 찾기 (없으면 에러 발생)
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 2. 비밀번호 일치 여부 확인 (입력한 비번과 DB의 암호화된 비번 비교)
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 비밀번호까지 맞다면 방문증(JWT 토큰) 발급!
        String token = jwtUtil.generateToken(user.getUserId(), user.getRole());

        // 4. 프론트엔드에 보낼 응답 상자(DTO)에 담아서 반환
        return new AuthDto.LoginResponse(token, user.getUserId(), user.getName(), user.getRole());
    }
}