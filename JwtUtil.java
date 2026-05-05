// src/main/java/pinword/security/JwtUtil.java
package pinword.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * [JWT 유틸리티 클래스]
 * * 아키텍트의 시선:
 * 이 클래스는 토큰을 '생성'하고 '해석'하는 기능만 담당하도록 응집도를 높였습니다.
 * @Component 어노테이션을 붙여서 스프링이 이 기계를 알아서 관리하도록 합니다.
 */
@Component
public class JwtUtil {

    private final Key key;
    
    // 토큰의 유효 기간을 설정합니다. (1000ms * 60초 * 60분 * 24시간 = 하루)
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // 생성자: application.yml에 우리가 적어둔 'jwt.secret' 값을 불러와서 암호화 열쇠(Key)로 만듭니다.
    public JwtUtil(@Value("${jwt.secret}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 1. 새로운 JWT 토큰 발행 (로그인 성공 시 호출됨)
    public String generateToken(Long userId, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // 토큰의 주인(주제)은 userId로 설정
                .claim("role", role) // 토큰 안에 유저의 권한(ADMIN/USER) 정보도 슬쩍 넣어둡니다.
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 우리의 비밀 열쇠로 위조 방지 도장을 찍습니다.
                .compact(); // 최종적으로 하나의 문자열로 압축!
    }

    // 2. 토큰에서 유저 ID 꺼내기 (API 요청이 올 때 누구인지 확인할 때 사용)
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    // 3. 토큰에서 유저 권한 꺼내기 (이 사람이 관리자 전용 API를 쓸 수 있는지 확인할 때 사용)
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // 4. 토큰이 위조되지 않았는지, 만료되지 않았는지 유효성 검사
    public boolean validateToken(String token) {
        try {
            getClaims(token); // 토큰을 열어보는 시도를 합니다. 에러가 안 나면 정상 토큰!
            return true;
        } catch (Exception e) {
            return false; // 만료되었거나, 위조되었거나, 이상한 토큰이면 false 반환
        }
    }

    // (내부 전용 함수) 토큰의 포장을 뜯어서 내용물(Claims)을 확인하는 로직
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}