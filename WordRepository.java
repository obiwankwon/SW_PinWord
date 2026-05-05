// src/main/java/pinword/repository/WordRepository.java
package pinword.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pinword.entity.Word;
import java.util.Optional;

/**
 * [단어 저장소 인터페이스]
 * DB의 words 테이블과 소통하는 유일한 창구입니다. (단일 책임 원칙)
 */
public interface WordRepository extends JpaRepository<Word, Long> {
    
    // 💡 프레임워크 예외 규칙 허용: existsBy...
    // 단어 등록 시, 이미 DB에 똑같은 철자(englishSpelling)의 단어가 있는지 중복 체크할 때 사용합니다.
    boolean existsByEnglishSpelling(String englishSpelling);

    // 💡 2. 스펠링으로 단어 정보를 통째로 찾아오는 기능
    // QuizService에서 채점할 때 "이 스펠링의 정답(뜻)이 뭐야?"라고 물어볼 때 사용합니다.
    Optional<Word> findByEnglishSpelling(String englishSpelling);
}