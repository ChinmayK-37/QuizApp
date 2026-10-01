package com.example.quizapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QuizappApplication {
	public static void main(String[] args) {
		
		SpringApplication.run(QuizappApplication.class, args);
		// System.out.println(System.getenv("GOOGLE_API_KEY"));
	}
}
			
