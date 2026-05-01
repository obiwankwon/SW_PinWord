package pinword.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * [단어장 (Vocabulary Book) 엔티티]
 * 사용자가 생성하는 '단어장 폴더' 역할을 하는 테이블(vocab_books)과 매칭됩니다.
 * 예를 들어 "토익 필수 영단어", "수능 1일차" 같은 묶음을 만듭니다.
 */
@Entity
@Table(name = "vocab_books")
@Getter @Setter
public class VocabBook {

    @Id // [PK] 각 단어장의 고유 식별 번호
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    // =========================================================================
    // [관계 매핑] 누가 이 단어장을 만들었는지 주인을 연결합니다.
    // =========================================================================

    // 단어장과 사용자의 관계 (N:1)
    // 한 명의 사용자(One)가 여러 개의 단어장(Many)을 만들 수 있습니다.
    // 💡 시니어의 팁 (지연 로딩):
    // 단어장 목록만 화면에 쭉 띄울 때, 작성자의 전체 개인정보(User)까지 억지로 끌고 올 필요가 없습니다.
    // FetchType.LAZY를 걸어두면 단어장 정보만 먼저 빠르게 가져오고, 유저 정보는 정말 필요할 때만 가져와서 DB 부하를 줄입니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB에 만들어질 외래키(FK) 컬럼명: 단어장을 만든 사용자 ID
    private User user;

    // =========================================================================
    // [일반 컬럼] 단어장의 상세 정보
    // =========================================================================

    // 단어장의 이름 (필수 입력값)
    // nullable = false 이므로 이름이 없는 단어장은 DB에서 저장을 거부합니다.
    @Column(nullable = false, length = 100)
    private String title;

    // 단어장에 대한 간단한 설명 메모 (선택 사항)
    // 예: "이번 주 금요일까지 무조건 다 외워야 하는 단어들!"
    // 글자 수 제한 없이 넉넉하게 쓸 수 있도록 TEXT 타입으로 지정했습니다.
    @Column(columnDefinition = "TEXT")
    private String description;
}