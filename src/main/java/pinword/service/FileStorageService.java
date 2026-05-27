package pinword.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

/**
 * 💡 [신규 생성] 파일 저장 전담 요리사
 * 사용자가 올린 이미지를 서버 컴퓨터의 안전한 곳(uploads 폴더)에 물리적으로 저장하는 일을 합니다.
 */
@Service
public class FileStorageService {

    // 이미지를 저장할 서버 내의 폴더 경로 (프로젝트 폴더 안에 'uploads'라는 이름으로 생깁니다)
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    // 서버가 켜질 때 이 요리사가 가장 먼저 하는 일: 'uploads' 폴더가 없으면 새로 만듭니다.
    public FileStorageService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("업로드 디렉토리를 생성할 수 없습니다.", ex);
        }
    }

    /**
     * AI가 생성한 이미지 바이트 배열을 받아서 저장하고, 그 파일의 웹 주소를 알려줍니다. (UUID 포함)
     */
    public String storeFileFromBytes(byte[] bytes, String fileName) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.write(targetLocation, bytes);
            return "/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("AI 이미지 저장 실패: " + fileName, ex);
        }
    }

    /**
     * AI 생성 이미지를 UUID 없이 파일명 그대로 저장합니다.
     */
    public String storeFileFromBytesNoUUID(byte[] bytes, String fileName) {
        try {
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.write(targetLocation, bytes, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.TRUNCATE_EXISTING);
            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("AI 이미지 저장 실패: " + fileName, ex);
        }
    }

    /**
     * 프론트에서 넘어온 이미지 파일을 받아서 저장하고, 그 파일의 웹 주소를 알려줍니다.
     */
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return null; // 파일이 없으면 그냥 넘어감

        // 원본 파일명 (예: apple.jpg)
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        // 💡 [시니어의 팁] 유저들이 모두 'apple.jpg'라는 이름으로 올리면 파일이 덮어씌워집니다.
        // 그래서 절대 안 겹치는 고유번호(UUID)를 파일명 앞에 붙여줍니다. 
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            // 진짜로 파일을 복사해서 폴더에 넣습니다.
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // DB에 저장하기 위해 예쁘게 포장한 URL 주소를 반환합니다.
            return "/uploads/" + fileName; 
        } catch (IOException ex) {
            throw new RuntimeException("파일 저장 실패: " + fileName, ex);
        }
    }
}