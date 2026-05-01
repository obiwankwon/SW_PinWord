package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * [퀴즈 문제 상세 (Quiz Question) 엔티티]
 * 데이터베이스의 'quiz_questions' 테이블과 매칭되는 클래스입니다.
 * 하나의 테이블에서 객관식(4지선다)과 주관식(단답형)을 모두 저장할 수 있도록 설계되었습니다. (단일 테이블 전략)
 */
@Entity
@Table(name = "quiz_questions")
@Getter @Setter
public class QuizQuestion {

    @Id // [PK] 각 문제의 고유 식별 번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    // =========================================================================
    // [관계 매핑]
    // =========================================================================

    // 여러 개의 문제(Many)는 하나의 문제지(One)에 속합니다. (지연 로딩 적용)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_id") // FK (문제지)
    private QuizPaper quizPaper;

    // 여러 개의 문제가 같은 단어(One)를 출제 범위로 가질 수 있습니다. (지연 로딩 적용)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id") // FK (단어)
    private Word word;

    // =========================================================================
    // [공통 컬럼] 객관식, 주관식 상관없이 항상 사용하는 컬럼입니다.
    // =========================================================================

    // 문제 지문 (긴 글 저장을 위해 TEXT 타입 사용)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    // ✨ 핵심 변경 포인트 1: 이 문제가 객관식인지 단답형인지 구분하는 명찰(타입)
    // EnumType.STRING을 사용하면 DB에 숫자(0, 1)가 아닌 문자열("MULTIPLE_CHOICE") 그대로 저장되어 알아보기 쉽습니다.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestionType questionType;

    // =========================================================================
    // [객관식 전용 컬럼] (단답형일 때는 null로 비워둡니다)
    // =========================================================================

    private String choice1; // 보기 1
    private String choice2; // 보기 2
    private String choice3; // 보기 3
    private String choice4; // 보기 4
    private Integer correctChoice; // 객관식 정답 번호 (1~4)

    // =========================================================================
    // [단답형 전용 컬럼] (객관식일 때는 null로 비워둡니다)
    // =========================================================================

    // 단답형 주관식 문제의 정답 텍스트 (예: "apple", "의사소통")
    @Column(length = 100)
    private String correctShortAnswer;
}