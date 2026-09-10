package com.blaise.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "skills")
@Data
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String icon;
    private Integer proficiency;

    @Column(columnDefinition = "TEXT")
    private String description;
}
