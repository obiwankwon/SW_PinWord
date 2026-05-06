// src/main/java/pinword/controller/AuthController.java
package pinword.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pinword.dto.AuthDto;
import pinword.service.AuthService;

/**
 * [인증 API 컨트롤러]
 * 프론트엔드(React)와 백엔드가 소통하는 창구입니다.
 * URL 경로가 "/api/auth"로 시작하는 모든 요청을 여기서 받습니다.
 */
@RestController // 이 클래스가 REST API 요청을 처리하는 컨트롤러임을 명시합니다. (응답을 JSON 형식으로 자동 변환)
@RequestMapping("/api/auth") // 이 컨트롤러의 공통 URL 주소입니다.
@RequiredArgsConstructor // final로 선언된 AuthService를 자동으로 연결(주입)해 줍니다.
public class AuthController {

    // 비즈니스 로직을 처리할 담당 부서(Service)를 연결합니다.
    private final AuthService authService;

    // [API 1] 회원가입 (POST /api/auth/signup)
    // @RequestBody: 프론트엔드에서 보낸 JSON 데이터를 자바의 SignupRequest(DTO) 객체로 자동 변환해 줍니다.
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody AuthDto.SignupRequest request) {
        try {
            // 서비스 부서에 회원가입 업무를 지시합니다.
            authService.registerUser(request);
            // 성공하면 200 OK 상태 코드와 함께 성공 메시지를 보냅니다.
            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            // 이메일 중복 등의 에러가 발생하면 400 Bad Request 상태 코드와 에러 메시지를 보냅니다.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // [API 2] 로그인 (POST /api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
        try {
            // 서비스 부서에 로그인 업무를 지시하고, 결과물(토큰과 유저 정보)을 받습니다.
            AuthDto.LoginResponse response = authService.login(request);
            // 성공하면 결과물(JSON)을 그대로 프론트엔드에 전달합니다.
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 비밀번호 틀림, 없는 이메일 등의 에러 시 400 상태 코드 반환
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}