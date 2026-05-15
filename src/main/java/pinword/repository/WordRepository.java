package pinword.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pinword.entity.Word;
import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<Word, Long> {
    
    // (기존에 작성하셨던 메서드들)
    boolean existsByEnglishSpelling(String englishSpelling);
    Optional<Word> findByEnglishSpelling(String englishSpelling);

    /**
     * 💡 [신규 추가] 이미지가 있는 단어만 쏙쏙 골라오는 전용 조회 기능!
     * 나중에 '이미지 퀴즈' 등을 할 때 이미지가 없는 단어가 섞이지 않게 미리 필터링합니다.
     */
    List<Word> findByImagePathIsNotNull();
}