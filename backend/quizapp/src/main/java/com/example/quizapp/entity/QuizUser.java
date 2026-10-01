package com.example.quizapp.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizUser {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long userId;
    
    @Column(nullable=false)
    private  String name;

    @Column(nullable=false,unique=true)
    private  String email;
    private  int age;
    private  String profession;
    @Column(nullable=false)
    private  String password;
}