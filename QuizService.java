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

            return new QuizDto.Question(word.getEnglishSpelling(), word.getMeaning(), options);
        }).collect(Collectors.toList());

        // 3. 만들어진 시험지 번호(paperId)와 문제들을 같이 반환합니다.
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
     * 💡 [신규] 최종 시험 결과 DB 저장
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
}