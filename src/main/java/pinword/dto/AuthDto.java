package pinword.dto;

/**
 * [인증 관련 DTO 모음]
 * * 아키텍트의 시선:
 * 프론트엔드와 백엔드가 데이터를 주고받을 때 사용하는 '규격화된 택배 상자'입니다.
 * Java의 'record' 기능을 사용하면 번거로운 Getter, Setter 없이 아주 깔끔하게 데이터를 담을 수 있습니다.
 */
public class AuthDto {

    // 1. 회원가입할 때 프론트엔드에서 백엔드로 보내는 데이터 상자
    public record SignupRequest(
            String email,
            String password,
            String name
    ) {}

    // 2. 로그인할 때 프론트엔드에서 백엔드로 보내는 데이터 상자
    public record LoginRequest(
            String email,
            String password
    ) {}

    // 3. 로그인 성공 시 백엔드에서 프론트엔드로 보내주는 응답 상자 (방문증 + 유저 정보)
    public record LoginResponse(
            String token,  // 발급된 JWT 토큰
            Long userId,   // 유저 고유 번호
            String name,   // 유저 이름
            String role    // 유저 권한 (ROLE_USER 등)
    ) {}
}