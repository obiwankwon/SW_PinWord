package pinword.dto;

/**
 * [단어 관련 DTO 모음]
 * 프론트엔드와 백엔드가 단어 데이터를 주고받을 때 사용하는 '규격화된 택배 상자'입니다.
 * 팀원이 작성한 엔티티(Word.java)의 필드명에 정확히 맞춰서 재설계했습니다.
 * 💡 [신규 추가]: 이번 이미지 고도화 작업을 위해 Response 상자에 'imagePath' 필드가 추가되었습니다!
 */
public class WordDto {

    // 1. 단어 등록/수정 시 프론트엔드에서 백엔드로 보내는 요청 상자
    // (이미지 파일 자체는 이 상자에 담지 않고 컨트롤러에서 별도의 MultipartFile로 받습니다.)
    public record Request(
            String englishSpelling, // 영단어 스펠링 (엔티티 필드명 일치)
            String meaning,         // 한글 뜻
            String partOfSpeech,    // 품사 (예: 명사, 동사)
            String imagePath        // AI 생성 이미지 경로 (직접 업로드 대신 사용, 선택사항)
    ) {}

    // AI 이미지 생성 요청 상자
    public record GenerateImageRequest(String englishWord) {}

    // AI 이미지 생성 응답 상자
    public record GenerateImageResponse(String imagePath) {}

    // 2. 단어 처리 성공 시 백엔드에서 프론트엔드로 보내주는 응답 상자
    public record Response(
            Long wordId,            // DB에 저장된 단어의 고유 식별자(PK)
            String englishSpelling, // 저장된 영단어
            String meaning,         // 저장된 뜻
            String partOfSpeech,    // 저장된 품사
            
            // 💡 [신규 추가] 프론트엔드가 이미지 태그(<img src="...">)에 넣을 수 있는 웹 접근 주소입니다.
            String imagePath        
    ) {}
}