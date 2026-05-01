package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * [퀴즈 풀이 내역 (Quiz Result) 엔티티]
 * 사용자가 퀴즈를 풀고 난 후의 '결과(성적표)'를 저장하는 테이블(quiz_results)과 매칭됩니다.
 * 누가(User), 어떤 문제지(QuizPaper)를 풀어서, 몇 점을 받았는지 기록합니다.
 */
@Entity
@Table(name = "quiz_results")
@Getter @Setter
public class QuizResult {

    @Id // [PK] 각 성적표의 고유 식별 번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    // =========================================================================
    // [관계 매핑] "누가" "어떤 시험"을 봤는지 연결합니다.
    // =========================================================================

    // 1. 사용자와 성적표의 관계 (N:1)
    // 한 명의 사용자(One)가 여러 번 퀴즈를 풀어 여러 개의 성적표(Many)를 가질 수 있습니다.
    @ManyToOne(fetch = FetchType.LAZY) // 실무 필수 설정인 지연 로딩(Lazy) 적용
    @JoinColumn(name = "user_id") // DB에 저장될 외래키(FK) 컬럼명: 사용자 ID
    private User user;

    // 2. 문제지와 성적표의 관계 (N:1)
    // 하나의 문제지(One)에 대해 여러 명의 학생이 푼 성적표(Many)가 쌓일 수 있습니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_id") // DB에 저장될 외래키(FK) 컬럼명: 문제지 ID
    private QuizPaper quizPaper;

    // =========================================================================
    // [일반 컬럼] 성적 및 시간 정보
    // =========================================================================

    // 사용자가 이 퀴즈에서 얻은 최종 점수 (맞춘 개수 또는 100점 환산 점수)
    private int score;

    // 💡 시니어의 팁 (시간 데이터 활용법):
    // 시작 시간과 종료 시간을 이렇게 따로 저장해두면 나중에 아주 멋진 기능들을 만들 수 있습니다!
    // 1. (종료 시간 - 시작 시간)을 계산해서 "이 학생은 평균적으로 1문제당 몇 초가 걸리는지" 통계를 낼 수 있습니다.
    // 2. 만약 50문제를 푸는데 2초밖에 안 걸렸다면? '매크로(부정행위)'로 간주하고 점수를 무효 처리하는 방어 로직도 짤 수 있습니다.
    private LocalDateTime startTime; // 퀴즈 풀이를 '시작'한 버튼을 누른 시간
    private LocalDateTime endTime;   // 퀴즈의 최종 '제출' 버튼을 누른 시간
}