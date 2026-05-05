// src/main/java/pinword/dto/QuizDto.java
package pinword.dto;

import java.util.List;

public class QuizDto {

    // 💡 1. 퀴즈를 출제할 때 '시험지 번호'도 같이 보냅니다.
    public record QuizResponse(
            Long paperId, 
            List<Question> questions
    ) {}

    // (기존) 문제 1개 규격
    public record Question(
            String englishSpelling,
            String correctAnswer,
            List<String> options
    ) {}

    // (기존) 유저가 푼 답안지 1개 규격
    public record SubmitRequest(
            String englishSpelling,
            String userAnswer
    ) {}

    // (기존) 한 문제 채점 결과
    public record ResultResponse(
            boolean isCorrect,
            String correctAnswer
    ) {}

    // 💡 2. 최종 점수를 낼 때 '시험지 번호'와 '유저의 모든 답'을 한 번에 받습니다.
    public record FinalSubmission(
            Long paperId,
            List<SubmitRequest> answers
    ) {}
}