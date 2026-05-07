package pinword.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pinword.entity.User;
import pinword.entity.Word;
import pinword.repository.UserRepository;
import pinword.repository.WordRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        loadWords();
        loadAdmins();
    }

    private void loadWords() throws Exception {
        ClassPathResource resource = new ClassPathResource("words.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String[] parts = line.split(",");
                if (parts.length < 3) continue;

                String spelling = parts[0].trim();
                String meaning  = parts[1].trim();
                String pos      = parts[2].trim();

                if (!wordRepository.existsByEnglishSpelling(spelling)) {
                    Word word = new Word();
                    word.setEnglishSpelling(spelling);
                    word.setMeaning(meaning);
                    word.setPartOfSpeech(pos);
                    wordRepository.save(word);
                }
            }
            System.out.println("[DataInitializer] 단어 초기 데이터 로딩 완료");
        }
    }

    private void loadAdmins() throws Exception {
        ClassPathResource resource = new ClassPathResource("admins.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                if (isHeader) { isHeader = false; continue; }

                String[] parts = line.split(",");
                if (parts.length < 3) continue;

                String email    = parts[0].trim();
                String name     = parts[1].trim();
                String password = parts[2].trim();

                if (!userRepository.existsByEmail(email)) {
                    User user = new User();
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode(password));
                    user.setName(name);
                    user.setRole("ROLE_ADMIN");
                    userRepository.save(user);
                    System.out.println("[DataInitializer] 관리자 계정 생성: " + name);
                }
            }
            System.out.println("[DataInitializer] 관리자 계정 초기화 완료");
        }
    }
}
