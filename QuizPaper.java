package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * [퀴즈 문제지 (Quiz Paper) 엔티티]
 * 데이터베이스의 'quiz_papers' 테이블과 1:1로 매칭되는 자바 클래스입니다.
 */
@Entity // 1. [JPA] 스프링에게 "이 클래스는 데이터베이스 테이블을 만들기 위한 설계도야!"라고 알려줍니다.
@Table(name = "quiz_papers") // 2. [JPA] 실제 MySQL에 생성될 테이블 이름을 지정합니다.
@Getter @Setter // 3. [Lombok] 눈에 보이지는 않지만 getPaperId(), setTitle() 같은 메서드들을 자동 생성해 줍니다.
public class QuizPaper {

    // ---------------------------------------------------------
    // 아래부터는 테이블의 컬럼(Column)들을 정의합니다.
    // ---------------------------------------------------------

    @Id // [PK] 이 테이블의 기본키(Primary Key - 고유 식별자)임을 명시합니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL의 AUTO_INCREMENT 역할 (데이터가 추가될 때마다 1, 2, 3... 자동 증가)
    private Long paperId;

    @Column(length = 100) // DB에 VARCHAR(100)으로 만들어 달라는 설정입니다.
    private String title; // 문제지 제목 (예: "토익 필수 영단어 1회차")

    // @Column을 생략하면 기본값으로 일반 컬럼(INT)이 생성됩니다.
    // 기본값을 0으로 설정하여, 처음 문제지가 만들어질 때 문항 수가 0부터 시작하도록 합니다.
    private int totalQuestions = 0;

    // 엔티티가 생성되는 순간의 현재 시간(LocalDateTime.now())을 기본값으로 넣습니다.
    // DB에는 DATETIME 또는 TIMESTAMP 형식으로 저장됩니다.
    private LocalDateTime createdAt = LocalDateTime.now();
}