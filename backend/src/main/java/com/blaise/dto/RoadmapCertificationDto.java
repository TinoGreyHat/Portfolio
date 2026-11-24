package com.blaise.dto;

import com.blaise.entity.RoadmapCertification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapCertificationDto {
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "L'organisme est obligatoire")
    private String organization;

    private LocalDate obtainedDate;

    @Pattern(regexp = "^(https?://).*$", message = "URL invalide (doit commencer par http:// ou https://)")
    private String certificateUrl;

    public static RoadmapCertificationDto fromEntity(RoadmapCertification entity) {
        RoadmapCertificationDto dto = new RoadmapCertificationDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setOrganization(entity.getOrganization());
        dto.setObtainedDate(entity.getObtainedDate());
        dto.setCertificateUrl(entity.getCertificateUrl());
        return dto;
    }

    public RoadmapCertification toEntity() {
        RoadmapCertification entity = new RoadmapCertification();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setOrganization(this.organization);
        entity.setObtainedDate(this.obtainedDate);
        entity.setCertificateUrl(this.certificateUrl);
        return entity;
    }
}