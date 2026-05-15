// src/main/java/pinword/service/QuizService.java
package pinword.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pinword.dto.QuizDto;
import pinword.entity.QuizPaper;
import pinword.entity.QuizResult;
import pinword.entity.User;
import pinword.entity.Word;
import pinword.repository.QuizPaperRepository;
import pinword.repository.QuizResultRepository;
import pinword.repository.UserRepository;
import pinword.repository.WordRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final WordRepository wordRepository;
    private final QuizPaperRepository quizPaperRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    /**
     * 💡 퀴즈 출제 (시험지 DB 생성 포함)
     */
    @Transactional
    public QuizDto.QuizResponse generateQuiz() {
        List<Word> allWords = wordRepository.findAll();
        if (allWords.size() < 4) {
            throw new IllegalArgumentException("단어가 부족합니다.");
        }

        // 1. DB에 빈 '시험지'를 먼저 만듭니다.
        QuizPaper paper = new QuizPaper();
        paper.setTitle("오늘의 랜덤 퀴즈");
        paper.setTotalQuestions(5);
        quizPaperRepository.save(paper);

        // 2. 단어를 섞어서 5문제를 만듭니다.
        List<Word> shuffled = new ArrayList<>(allWords);
        Collections.shuffle(shuffled);

        List<QuizDto.Question> questions = shuffled.stream().limit(5).map(word -> {
            List<String> options = new ArrayList<>();
            options.add(word.getMeaning());

            List<String> wrongs = allWords.stream()
                    .filter(w -> !w.getWordId().equals(word.getWordId()))
                    .map(Word::getMeaning)
                    .collect(Collectors.toList());
            Collections.shuffle(wrongs);
            options.addAll(wrongs.subList(0, 3));
            Collections.shuffle(options);

            // 💡 [수정] DTO에 imagePath가 추가되었으므로 일반 퀴즈는 null을 넘겨줍니다.
            return new QuizDto.Question(word.getEnglishSpelling(), word.getMeaning(), options, null);
        }).collect(Collectors.toList());

        // 3. 만들어진 시험지 번호(paperId)와 문제들을 같이 반환합니다.
        return new QuizDto.QuizResponse(paper.getPaperId(), questions);
    }

    /**
     * 💡 [신규] 이미지 퀴즈 출제 로직
     */
    @Transactional
    public QuizDto.QuizResponse generateImageQuiz() {
        List<Word> allWords = wordRepository.findAll();
        // 이미지가 있는 단어만 불러옵니다.
        List<Word> imageWords = wordRepository.findByImagePathIsNotNull();

        if (imageWords.size() < 5) {
            throw new IllegalArgumentException("이미지가 등록된 단어가 5개 이상 필요합니다.");
        }

        QuizPaper paper = new QuizPaper();
        paper.setTitle("오늘의 이미지 퀴즈");
        paper.setTotalQuestions(5);
        quizPaperRepository.save(paper);

        List<Word> shuffledImages = new ArrayList<>(imageWords);
        Collections.shuffle(shuffledImages);

        List<QuizDto.Question> questions = shuffledImages.stream().limit(5).map(word -> {
            List<String> options = new ArrayList<>();
            // 💡 정답은 영단어 스펠링!
            options.add(word.getEnglishSpelling()); 

            // 💡 오답 3개는 전체 단어 중에서 무작위로 추출하여 영단어로 보기 구성
            List<String> wrongs = allWords.stream()
                    .filter(w -> !w.getWordId().equals(word.getWordId()))
                    .map(Word::getEnglishSpelling) 
                    .collect(Collectors.toList());
            Collections.shuffle(wrongs);
            options.addAll(wrongs.subList(0, 3));
            Collections.shuffle(options);

            // 💡 문제 텍스트(meaning) 대신 이미지 경로를 실어 보냅니다.
            return new QuizDto.Question(word.getEnglishSpelling(), word.getEnglishSpelling(), options, word.getImagePath());
        }).collect(Collectors.toList());

        return new QuizDto.QuizResponse(paper.getPaperId(), questions);
    }

    /**
     * 💡 [기존] 1문제 단순 채점 (유지)
     */
    @Transactional(readOnly = true)
    public QuizDto.ResultResponse checkAnswer(QuizDto.SubmitRequest request) {
        Word word = wordRepository.findByEnglishSpelling(request.englishSpelling())
                .orElseThrow(() -> new IllegalArgumentException("단어 없음"));
        boolean isCorrect = word.getMeaning().equals(request.userAnswer().trim());
        return new QuizDto.ResultResponse(isCorrect, word.getMeaning());
    }

    /**
     * 💡 [기존] 최종 시험 결과 DB 저장
     */
    @Transactional
    public int saveQuizResult(Long userId, QuizDto.FinalSubmission submission) {
        // 1. 유저와 시험지 정보 가져오기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        QuizPaper paper = quizPaperRepository.findById(submission.paperId())
                .orElseThrow(() -> new IllegalArgumentException("시험지 없음"));

        // 2. 5문제 채점해서 점수 계산 (1문제당 20점)
        int score = 0;
        for (QuizDto.SubmitRequest req : submission.answers()) {
            Word word = wordRepository.findByEnglishSpelling(req.englishSpelling()).orElse(null);
            if (word != null && word.getMeaning().equals(req.userAnswer().trim())) {
                score += 20;
            }
        }

        // 3. 최종 결과 DB 저장
        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setQuizPaper(paper);
        result.setScore(score);
        result.setStartTime(paper.getCreatedAt()); 
        result.setEndTime(LocalDateTime.now());
        
        quizResultRepository.save(result);
        
        return score;
    }

    /**
     * 💡 [신규] 이미지 퀴즈 결과 DB 저장
     * 이미지 퀴즈는 '유저가 선택한 영단어'와 '실제 정답 영단어'가 일치하는지 확인합니다.
     */
    @Transactional
    public int saveImageQuizResult(Long userId, QuizDto.FinalSubmission submission) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        QuizPaper paper = quizPaperRepository.findById(submission.paperId())
                .orElseThrow(() -> new IllegalArgumentException("시험지 없음"));

        int score = 0;
        for (QuizDto.SubmitRequest req : submission.answers()) {
            // req.englishSpelling()이 문제의 정답, req.userAnswer()가 유저가 누른 보기
            if (req.englishSpelling().equals(req.userAnswer().trim())) {
                score += 20;
            }
        }

        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setQuizPaper(paper);
        result.setScore(score);
        result.setStartTime(paper.getCreatedAt()); 
        result.setEndTime(LocalDateTime.now());
        
        quizResultRepository.save(result);
        
        return score;
    }

    @Transactional(readOnly = true)
    public QuizDto.QuizStatisticsResponse getStatistics(Long userId) {
        // 1. 유저의 모든 퀴즈 기록 가져오기
        List<QuizResult> results = quizResultRepository.findAllByUser_UserIdOrderByStartTimeAsc(userId);
        
        // 2. 누적 학습량
        long totalQuizzes = results.size();
        
        // 3. 평균 점수 (기록이 없으면 0점)
        double averageScore = results.stream().mapToInt(QuizResult::getScore).average().orElse(0.0);
        // 소수점 첫째 자리까지만 예쁘게 자르기 (예: 85.3)
        averageScore = Math.round(averageScore * 10) / 10.0;

        // 4. 최근 학습 추이 (최대 최근 5개만 뽑기)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd HH:mm");
        List<QuizDto.ScoreHistory> recentScores = results.stream()
                .skip(Math.max(0, results.size() - 5)) // 뒤에서 5개만 자르기
                .map(r -> new QuizDto.ScoreHistory(
                        r.getStartTime().format(formatter), 
                        r.getScore()
                ))
                .collect(Collectors.toList());

        return new QuizDto.QuizStatisticsResponse(totalQuizzes, averageScore, recentScores);
    }
}