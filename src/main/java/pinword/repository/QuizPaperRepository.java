package pinword.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pinword.entity.QuizPaper;

public interface QuizPaperRepository extends JpaRepository<QuizPaper, Long> {
}