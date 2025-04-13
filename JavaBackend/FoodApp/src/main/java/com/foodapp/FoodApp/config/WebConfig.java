package com.foodapp.FoodApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // Allow all endpoints
                .allowedOrigins("*")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific methods
                .allowedHeaders("*");  // Allow all headers
    }
}