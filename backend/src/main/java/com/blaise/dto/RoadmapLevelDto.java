package com.blaise.dto;

import com.blaise.entity.RoadmapLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapLevelDto {
    private Long id;
    private Integer levelNumber;
    private String title;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String summary;
    private Integer progress;
    private List<RoadmapExperienceDto> experiences;
    private List<RoadmapCertificationDto> certifications;
    private List<RoadmapToolDto> tools;

    public static RoadmapLevelDto fromEntity(RoadmapLevel level) {
        RoadmapLevelDto dto = new RoadmapLevelDto();
        dto.setId(level.getId());
        dto.setLevelNumber(level.getLevelNumber());
        dto.setTitle(level.getTitle());
        dto.setStatus(level.getStatus().name());
        dto.setStartDate(level.getStartDate());
        dto.setEndDate(level.getEndDate());
        dto.setSummary(level.getSummary());
        dto.setProgress(level.getProgress());

        if (level.getExperiences() != null) {
            dto.setExperiences(level.getExperiences().stream()
                .map(RoadmapExperienceDto::fromEntity)
                .toList());
        }
        if (level.getCertifications() != null) {
            dto.setCertifications(level.getCertifications().stream()
                .map(RoadmapCertificationDto::fromEntity)
                .toList());
        }
        if (level.getTools() != null) {
            dto.setTools(level.getTools().stream()
                .map(RoadmapToolDto::fromEntity)
                .toList());
        }
        return dto;
    }

    public void updateEntity(RoadmapLevel entity) {
        entity.setTitle(this.title);
        entity.setStatus(RoadmapLevel.LevelStatus.valueOf(this.status));
        entity.setStartDate(this.startDate);
        entity.setEndDate(this.endDate);
        entity.setSummary(this.summary);
        if (this.progress != null) {
            entity.setProgress(this.progress);
        }
    }
}