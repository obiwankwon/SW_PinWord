package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * [단어장 상세 (Vocabulary Book Detail) 엔티티]
 * '어떤 단어장에 어떤 단어가 들어있는지'를 연결해 주는 중간 다리 역할의 테이블입니다.
 *
 * 💡 시니어의 팁 (다대다 관계의 정석):
 * 하나의 단어장에는 여러 단어가 들어가고, 하나의 단어는 여러 단어장에 들어갈 수 있습니다 (N:M 관계).
 * 초보자들은 흔히 @ManyToMany를 쓰지만, 실무에서는 이 어노테이션을 절대(거의) 쓰지 않습니다!
 * 대신 지금 이 코드처럼 중간 테이블(Detail)을 직접 만들고 @ManyToOne 2개로 쪼개는 것이 완벽한 정답입니다.
 */
@Entity
@Table(name = "vocab_book_details")
@Getter @Setter
public class VocabBookDetail {

    @Id // [PK] 이 연결 데이터 자체의 고유 식별 번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailId;

    // =========================================================================
    // [관계 매핑] 양쪽(단어장, 단어)의 손을 꽉 잡아주는 역할입니다.
    // =========================================================================

    // 1. 단어장과의 연결 (N:1)
    // "이 상세 데이터는 어느 단어장에 속해 있는가?"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id") // DB에 저장될 외래키(FK) 컬럼명: 단어장 ID
    private VocabBook vocabBook;

    // 2. 단어와의 연결 (N:1)
    // "그래서 그 단어장에 들어간 단어가 구체적으로 뭔데?"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id") // DB에 저장될 외래키(FK) 컬럼명: 단어 ID
    private Word word;

    // =========================================================================
    // [일반 컬럼] 매핑 테이블만의 추가 정보
    // =========================================================================

    // 사용자가 이 단어를 단어장에서 몇 번이나 들여다봤는지 조회수를 기록합니다.
    // 기본값을 0으로 설정하여, 단어장에 처음 추가됐을 때는 조회수가 0부터 시작합니다.
    // (이런 추가 컬럼을 넣기 위해서라도 @ManyToMany 대신 이 매핑 테이블을 직접 만들어야 합니다!)
    private int viewCount = 0;
}