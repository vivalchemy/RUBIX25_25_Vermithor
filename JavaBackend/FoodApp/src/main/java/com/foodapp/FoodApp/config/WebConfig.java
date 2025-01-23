import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/")  // Allow all endpoints
                .allowedOrigins("*")  // Allow React frontend
                .allowedMethods("*")  // Allow specific methods
                .allowedHeaders("*");  // Allow all headers
    }
}