// src/main/java/pinword/repository/UserRepository.java
package pinword.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pinword.entity.User;
import java.util.Optional;

/**
 * [사용자 저장소 인터페이스]
 * * 아키텍트의 시선:
 * 이 클래스는 '단일 책임 원칙(SRP)'에 따라 오직 User 데이터베이스에 접근하는 역할만 맡습니다.
 * JpaRepository를 상속받으면, 기본적인 CRUD(생성,조회,수정,삭제) 기능이 자동으로 완성됩니다.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 1. 이메일로 사용자 찾기
    // 로그인할 때 사용자가 입력한 이메일이 DB에 존재하는지 확인할 때 사용합니다.
    // Optional을 사용하여, 사용자가 없을 경우 발생할 수 있는 에러(NullPointerException)를 안전하게 방지합니다.
    Optional<User> findByEmail(String email);
    
    // 2. 이메일 중복 확인
    // 회원가입할 때 이미 똑같은 이메일로 가입한 사람이 있는지 확인합니다. (존재하면 true, 없으면 false 반환)
    boolean existsByEmail(String email);
}