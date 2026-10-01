package com.example.quizapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.genai.Client;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class GeminiConfig {

    @Bean
    public Client geminiClient() {

        // Hosting platforms supply secrets as process environment variables.
        // The .env file remains a local-development fallback.
        String apiKey = System.getenv("GOOGLE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            Dotenv dotenv = Dotenv.configure()
                    .directory("src/main/resources")
                    .ignoreIfMissing()
                    .load();
            apiKey = dotenv.get("GOOGLE_API_KEY");
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GOOGLE_API_KEY must be configured");
        }

        return new Client.Builder()
                .apiKey(apiKey)
                .build();
    }
}
