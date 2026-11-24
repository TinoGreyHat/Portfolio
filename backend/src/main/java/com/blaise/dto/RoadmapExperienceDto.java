package com.blaise.dto;

import com.blaise.entity.RoadmapExperience;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapExperienceDto {
    private Long id;
    private String description;
    private Integer displayOrder;

    public static RoadmapExperienceDto fromEntity(RoadmapExperience entity) {
        RoadmapExperienceDto dto = new RoadmapExperienceDto();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setDisplayOrder(entity.getDisplayOrder());
        return dto;
    }

    public RoadmapExperience toEntity() {
        RoadmapExperience entity = new RoadmapExperience();
        entity.setId(this.id);
        entity.setDescription(this.description);
        entity.setDisplayOrder(this.displayOrder);
        return entity;
    }
}