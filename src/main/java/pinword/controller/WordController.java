package pinword.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pinword.dto.WordDto;
import pinword.service.WordService;
import java.util.List;

/**
 * [WordController: 단어 관리 및 조회 창구]
 * 프론트엔드(React)나 테스트 도구(Thunder Client)가 보낸 "단어 관련 요청"을 
 * 가장 먼저 받아서 담당 부서(WordService)에 전달하는 안내데스크 역할을 합니다.
 */
@RestController // 1. 이 클래스가 외부에서 호출할 수 있는 'API 창구'임을 스프링에게 알립니다.
@RequestMapping("/api") // 2. 이 컨트롤러의 모든 주소는 http://localhost:8080/api 로 시작합니다.
@RequiredArgsConstructor // 3. 밑에 선언한 wordService를 자동으로 연결(주입)해 줍니다.
public class WordController {

    // 우리가 만든 '단어 요리사(Service)'를 불러옵니다. 실제 일은 이 친구가 다 합니다.
    private final WordService wordService;

    // =========================================================================
    // [누구나 사용 가능한 기능: 조회]
    // =========================================================================

    /**
     * 💡 모든 단어 목록 가져오기 (GET http://localhost:8080/api/words)
     * 유저와 관리자 모두가 단어장을 구경할 수 있게 해주는 기능입니다.
     */
    @GetMapping("/words") // HTTP의 GET 방식(데이터 가져오기)으로 /words 주소에 연결합니다.
    public ResponseEntity<List<WordDto.Response>> getAllWords() {
        // 1. 서비스에게 "창고(DB)에 있는 단어 다 가져와!"라고 시킵니다.
        List<WordDto.Response> words = wordService.getAllWords();
        
        // 2. 가져온 단어 뭉치를 '200 OK'라는 성공 도장과 함께 프론트엔드에 전달합니다.
        return ResponseEntity.ok(words);
    }

    /**
     * 💡 [신규 추가] 이미지가 등록된 단어 목록만 가져오기 (GET http://localhost:8080/api/words/images)
     * 핀터레스트 스타일의 이미지 학습 창에서 호출하는 전용 API입니다.
     */
    @GetMapping("/words/images")
    public ResponseEntity<List<WordDto.Response>> getWordsWithImages() {
        return ResponseEntity.ok(wordService.getWordsWithImages());
    }

    // =========================================================================
    // [관리자(ADMIN)만 사용 가능한 기능: 관리]
    // 주소에 /admin이 포함되어 SecurityConfig에서 관리자만 통과하도록 감시합니다.
    // =========================================================================

    /**
     * 💡 새 단어 추가하기 (POST http://localhost:8080/api/admin/words)
     * 💡 [수정됨] POST 방식은 새로운 데이터를 '등록'할 때 씁니다.
     * 이제 텍스트(word)와 파일(image)을 동시에 받기 위해 @RequestPart를 사용합니다.
     */
    @PostMapping("/admin/words") 
    public ResponseEntity<?> addWord(
            @RequestPart("word") WordDto.Request request,
            @RequestPart(value = "image", required = false) MultipartFile image) { // 이미지는 필수가 아님
        try {
            return ResponseEntity.ok(wordService.addWord(request, image));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 💡 단어 정보 수정하기 (PATCH http://localhost:8080/api/admin/words/{wordId})
     * 💡 [수정됨] PATCH는 데이터의 '일부'만 고칠 때 씁니다. (수정 시 이미지 변경 가능)
     */
    @PatchMapping("/admin/words/{wordId}") 
    public ResponseEntity<?> updateWord(
            @PathVariable Long wordId, // 주소창의 {wordId} 숫자를 가져옵니다.
            @RequestPart(value = "word", required = false) WordDto.Request request, // 수정할 내용을 상자(DTO)로 받습니다.
            @RequestPart(value = "image", required = false) MultipartFile image) { // 새 이미지가 있다면 받습니다.
        try {
            return ResponseEntity.ok(wordService.updateWord(wordId, request, image));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 💡 단어 삭제하기 (DELETE http://localhost:8080/api/admin/words/{wordId})
     */
    @DeleteMapping("/admin/words/{wordId}") // DELETE는 말 그대로 '삭제' 명령입니다.
    public ResponseEntity<?> deleteWord(@PathVariable Long wordId) {
        try {
            wordService.deleteWord(wordId);
            return ResponseEntity.ok("단어가 성공적으로 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}