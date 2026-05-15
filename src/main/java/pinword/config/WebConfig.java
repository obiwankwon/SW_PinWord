package pinword.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * [웹 환경 설정: CORS 통행증 발급 및 정적 리소스 연결]
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 💡 [복구된 핵심 코드] CORS 설정
     * 리액트(5173 포트)에서 오는 모든 요청(GET, POST 등)을 안전한 요청으로 인식하고 허락해줍니다.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 백엔드의 모든 API 주소에 대하여
                .allowedOrigins("http://localhost:5173") // 리액트 주소의 접근을 허락함
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 허용할 행동들
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    /**
     * 💡 [기존 유지] 정적 파일(이미지) 제공 설정
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}