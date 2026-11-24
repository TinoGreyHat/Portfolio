package com.blaise.dto;

import com.blaise.entity.RoadmapTool;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapToolDto {
    private Long id;

    @NotBlank(message = "Le nom de l'outil est obligatoire")
    private String name;

    private Integer displayOrder = 0;

    public static RoadmapToolDto fromEntity(RoadmapTool entity) {
        RoadmapToolDto dto = new RoadmapToolDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDisplayOrder(entity.getDisplayOrder());
        return dto;
    }

    public RoadmapTool toEntity() {
        RoadmapTool entity = new RoadmapTool();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setDisplayOrder(this.displayOrder);
        return entity;
    }
}