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
            List<String> options,
            // 💡 [신규 추가] 이미지 퀴즈에서 이미지를 띄우기 위한 경로 (일반 퀴즈에선 null)
            String imagePath 
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

    // 💡 [신규] 통계 정보를 담을 상자
    public record QuizStatisticsResponse(
            long totalQuizzes,       // 누적 학습량
            double averageScore,     // 평균 정답률(점수)
            List<ScoreHistory> recentScores // 최근 학습 추이 (차트용)
    ) {}

    // 💡 [신규] 차트에 들어갈 점수 하나하나의 규격
    public record ScoreHistory(
            String date, // 푼 날짜 (예: "05/06 14:30")
            int score    // 점수
    ) {}
}