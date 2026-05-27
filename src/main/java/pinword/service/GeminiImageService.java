package pinword.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class GeminiImageService {

    private final FileStorageService fileStorageService;

    private static final String POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";

    private final HttpClient httpClient = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();

    public String generateAndSaveImage(String englishWord) {
        try {
            String prompt = buildPrompt(englishWord);
            String encodedPrompt = URLEncoder.encode(prompt, StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(POLLINATIONS_URL + encodedPrompt))
                .GET()
                .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() != 200) {
                throw new RuntimeException("이미지 생성 API 오류: " + response.statusCode());
            }

            String fileName = "ai_" + englishWord.toLowerCase().replaceAll("[^a-z0-9]", "_") + ".png";
            return fileStorageService.storeFileFromBytesNoUUID(response.body(), fileName);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("AI 이미지 생성 실패: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String word) {
        return String.format(
            "Generate an image of \"%s\", clean simple educational illustration, " +
            "single subject, white background, minimalist flat design, no text, no labels",
            word
        );
    }
}
