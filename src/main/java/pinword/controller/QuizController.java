package pinword.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pinword.dto.QuizDto;
import pinword.service.QuizService;

import java.security.Principal; // 💡 유저 ID를 안전하게 가져오기 위한 도구

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // 1. 퀴즈 문제 가져오기 (GET)
    @GetMapping
    public ResponseEntity<?> getQuiz() {
        try {
            return ResponseEntity.ok(quizService.generateQuiz());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💡 [신규] 이미지 퀴즈 문제 가져오기 (GET /image)
    @GetMapping("/image")
    public ResponseEntity<?> getImageQuiz() {
        try {
            return ResponseEntity.ok(quizService.generateImageQuiz());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. 한 문제 단순 채점 (POST /submit)
    @PostMapping("/submit")
    public ResponseEntity<QuizDto.ResultResponse> submitAnswer(@RequestBody QuizDto.SubmitRequest request) {
        return ResponseEntity.ok(quizService.checkAnswer(request));
    }

    // 💡 3. [기존] 최종 퀴즈 점수 저장 (POST /result)
    @PostMapping("/result")
    public ResponseEntity<?> saveResult(
            Principal principal, // 현재 로그인한 사람의 정보(userId)가 들어있음
            @RequestBody QuizDto.FinalSubmission submission) {
        
        // 토큰에서 추출한 유저 번호를 Long 타입으로 변환
        Long userId = Long.parseLong(principal.getName());
        
        // 서비스에 저장을 맡기고 최종 점수를 받아옴
        int finalScore = quizService.saveQuizResult(userId, submission);
        
        return ResponseEntity.ok("퀴즈 완료! 당신의 점수는 " + finalScore + "점입니다!");
    }

    // 💡 [신규] 최종 이미지 퀴즈 점수 저장 (POST /image/result)
    @PostMapping("/image/result")
    public ResponseEntity<?> saveImageResult(
            Principal principal,
            @RequestBody QuizDto.FinalSubmission submission) {
        
        Long userId = Long.parseLong(principal.getName());
        int finalScore = quizService.saveImageQuizResult(userId, submission);
        return ResponseEntity.ok("이미지 퀴즈 완료! 당신의 점수는 " + finalScore + "점입니다!");
    }

    // 💡 4. [신규] 퀴즈 통계 가져오기 (GET /stats)
    @GetMapping("/stats")
    public ResponseEntity<QuizDto.QuizStatisticsResponse> getStats(Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(quizService.getStatistics(userId));
    }
}