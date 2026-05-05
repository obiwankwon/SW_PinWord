package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * [사용자 (User) 엔티티]
 * 서비스에 가입한 회원의 정보를 담는 핵심 테이블(users)과 매칭됩니다.
 * 단어장, 성적표, 로그인 이력 등 다른 모든 데이터의 주인이 되는 '부모 엔티티'입니다.
 */
@Entity // 1. [JPA] 이 클래스를 기준으로 데이터베이스에 테이블을 만들라는 어노테이션
@Table(name = "users") // 2. [DB] 테이블 이름 지정 (💡 시니어 팁: user는 대부분의 DB 예약어라 충돌 시 서버가 다운될 수 있으므로 users로 하는 것이 안전합니다)
@Getter @Setter
public class User {

    @Id // [PK] 각 회원을 확실하게 구분하는 고유 식별 번호 (주민등록번호 같은 역할)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL의 AUTO_INCREMENT 역할 (가입할 때마다 1, 2, 3... 순차적으로 부여됨)
    private Long userId;

    // nullable = false : 비어있으면 안 됨 (NOT NULL)
    // unique = true : 중복 방지. 다른 사람이 이 이메일로 이미 가입했으면 에러를 발생시킵니다.
    @Column(nullable = false, unique = true, length = 100)
    private String email; // 로그인 아이디로 사용될 이메일

    // 💡 시니어의 팁 (보안):
    // 실제 서비스에서는 비밀번호를 절대 "1234"처럼 원본 그대로 저장하지 않습니다.
    // 나중에 Spring Security를 통해 암호화(해싱)된 아주 긴 문자열이 들어갈 자리입니다.
    @Column(nullable = false)
    private String password;

    // 회원의 이름이나 닉네임 (최대 50자까지만 허용하여 DB 용량 낭비를 막습니다)
    @Column(nullable = false, length = 50)
    private String name;

    // ✨ 추가된 권한 필드 2026.05.05_권용준
    // ROLE_USER, ROLE_ADMIN 등의 값이 저장됩니다.
    // 기본값을 "ROLE_USER"로 설정하여 회원가입 시 자동으로 일반 권한을 부여합니다.
    @Column(nullable = false, length = 20)
    private String role = "ROLE_USER";
}
