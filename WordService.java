package pinword.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pinword.dto.WordDto;
import pinword.entity.Word;
import pinword.repository.WordRepository;

// 💡 [준비물] 아래 두 줄이 없으면 'List'나 'Collectors'를 쓸 수 없어서 에러가 나!
import java.util.List;
import java.util.stream.Collectors;

/**
 * [WordService: 단어장 비즈니스 로직 요리사]
 * 컨트롤러(안내데스크)가 주문을 넣으면, 실제로 DB(창고)를 뒤져서 
 * 데이터를 가져오거나 가공하는 '진짜 실무'를 담당하는 곳이야.
 */
@Service // "나는 스프링이 관리하는 비즈니스 로직 담당자(Service)야!"라고 명함을 내미는 거야.
@RequiredArgsConstructor // "밑에 선언한 Repository(창고 관리인)를 자동으로 데려와줘!"라는 뜻.
public class WordService {

    // 창고(DB)에 직접 접근할 수 있는 열쇠를 가진 친구야.
    private final WordRepository wordRepository;

    /**
     * 💡 [업무 1] 단어 추가하기
     * 관리자가 보낸 새 단어 정보를 받아서 DB 창고에 집어넣어.
     */
    @Transactional
    public WordDto.Response addWord(WordDto.Request request) {
        // 이미 창고에 같은 스펠링의 단어가 있는지 확인해봐.
        if (wordRepository.existsByEnglishSpelling(request.englishSpelling())) {
            throw new IllegalArgumentException("이미 등록된 단어입니다.");
        }

        // 새 단어 상자(Entity)를 만들어서 내용을 채워.
        Word word = new Word();
        word.setEnglishSpelling(request.englishSpelling());
        word.setMeaning(request.meaning());
        word.setPartOfSpeech(request.partOfSpeech());

        // 창고 관리인(Repository)에게 저장을 부탁해.
        Word savedWord = wordRepository.save(word);

        // 저장이 끝나면 "잘 저장됐어!"라고 영수증(Response DTO)을 발행해줘.
        return new WordDto.Response(
                savedWord.getWordId(),
                savedWord.getEnglishSpelling(),
                savedWord.getMeaning(),
                savedWord.getPartOfSpeech()
        );
    }

    /**
     * 💡 [업무 2] 단어 수정하기
     * 특정 번호(wordId)의 단어를 찾아서 내용을 고쳐줘.
     */
    @Transactional
    public WordDto.Response updateWord(Long wordId, WordDto.Request request) {
        // 일단 해당 번호의 단어가 창고에 있는지 찾아보고, 없으면 에러를 내.
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("해당 단어를 찾을 수 없습니다."));

        // 단어가 있으면 요청받은 내용으로 한 땀 한 땀 고쳐줘.
        if (request.meaning() != null) word.setMeaning(request.meaning());
        if (request.partOfSpeech() != null) word.setPartOfSpeech(request.partOfSpeech());

        // 수정된 내용을 다시 영수증으로 만들어서 보내줘.
        return new WordDto.Response(
                word.getWordId(),
                word.getEnglishSpelling(),
                word.getMeaning(),
                word.getPartOfSpeech()
        );
    }

    /**
     * 💡 [업무 3] 단어 삭제하기
     */
    @Transactional
    public void deleteWord(Long wordId) {
        if (!wordRepository.existsById(wordId)) {
            throw new IllegalArgumentException("삭제할 단어가 존재하지 않습니다.");
        }
        wordRepository.deleteById(wordId);
    }

    /**
     * 💡 [업무 4] 전체 단어 목록 가져오기
     */
    @Transactional(readOnly = true) // 읽기만 할 때는 이 설정을 붙이면 속도가 더 빨라져!
    public List<WordDto.Response> getAllWords() {
        // 1. 창고에서 모든 단어(Word 엔티티)를 꺼내와.
        List<Word> words = wordRepository.findAll();
        
        // 2. 단어 뭉치를 우리가 프론트엔드에 줄 규격(Response DTO)으로 하나씩 변환해.
        return words.stream()
                .map(word -> new WordDto.Response(
                        word.getWordId(),
                        word.getEnglishSpelling(),
                        word.getMeaning(),
                        word.getPartOfSpeech()
                ))
                .collect(Collectors.toList()); // 3. 변환된 것들을 다시 '목록(List)'으로 묶어서 반환!
    }
}