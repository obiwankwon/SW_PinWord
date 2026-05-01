package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * [단어 (Word) 엔티티]
 * 우리 서비스의 가장 근본이 되는 '영단어 사전' 테이블(words)과 매칭됩니다.
 *
 * 💡 시니어의 팁 (데이터의 흐름):
 * 여기에 저장된 단어 데이터들이 모여서 '단어장(VocabBookDetail)'에 담기게 되고,
 * 나중에 '퀴즈 문제(QuizQuestion)'를 출제할 때 그 바탕(출제 범위)이 됩니다!
 */
@Entity
@Table(name = "words")
@Getter @Setter
public class Word {

    @Id // [PK] 각 단어를 확실하게 구분하는 고유 식별 번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordId;

    // =========================================================================
    // [일반 컬럼] 단어의 상세 정보
    // =========================================================================

    // 영단어 스펠링 (예: "apple", "communicate")
    // 단어 스펠링이 없으면 의미가 없으므로 nullable = false(필수값)로 설정합니다.
    @Column(nullable = false, length = 100)
    private String englishSpelling;

    // 단어의 한글 뜻 (예: "사과", "의사소통하다, 연락을 주고받다")
    // 💡 시니어의 칭찬 포인트: 단어의 뜻은 여러 개일 수 있고 콤마(,)로 길어질 수 있는데,
    // 이를 일반 VARCHAR 대신 TEXT 타입으로 지정하여 넉넉하게 저장할 수 있도록 한 아주 좋은 설계입니다!
    @Column(nullable = false, columnDefinition = "TEXT")
    private String meaning;

    // 품사 (예: "명사", "동사", "n.", "v.")
    // 모든 단어의 품사를 다 적지 않을 수도 있으므로 필수값(nullable = false) 제약은 걸지 않았습니다.
    // 최대 20자까지만 허용하여 DB 용량을 깔끔하게 관리합니다.
    @Column(length = 20)
    private String partOfSpeech;
}