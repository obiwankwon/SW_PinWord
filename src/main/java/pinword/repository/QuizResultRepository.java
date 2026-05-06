package pinword.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pinword.entity.QuizResult;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    // 💡 유저 번호로 모든 결과를 찾되, 시작 시간(startTime)을 기준으로 옛날 것부터 정렬해서 가져와라!
    List<QuizResult> findAllByUser_UserIdOrderByStartTimeAsc(Long userId);
}