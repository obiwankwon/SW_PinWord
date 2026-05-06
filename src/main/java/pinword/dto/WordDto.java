// src/main/java/pinword/dto/WordDto.java
package pinword.dto;

/**
 * [단어 관련 DTO 모음]
 * 프론트엔드와 백엔드가 단어 데이터를 주고받을 때 사용하는 '규격화된 택배 상자'입니다.
 * 팀원이 작성한 엔티티(Word.java)의 필드명에 정확히 맞춰서 재설계했습니다.
 */
public class WordDto {

    // 1. 단어 등록/수정 시 프론트엔드에서 백엔드로 보내는 요청 상자
    public record Request(
            String englishSpelling, // 영단어 스펠링 (엔티티 필드명 일치)
            String meaning,         // 한글 뜻
            String partOfSpeech     // 품사 (예: 명사, 동사)
    ) {}

    // 2. 단어 처리 성공 시 백엔드에서 프론트엔드로 보내주는 응답 상자
    public record Response(
            Long wordId,            // DB에 저장된 단어의 고유 식별자(PK)
            String englishSpelling, // 저장된 영단어
            String meaning,         // 저장된 뜻
            String partOfSpeech     // 저장된 품사
    ) {}
}