package com.blaise.dto;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationIssuer;
import lombok.Data;

@Data
public class CertificationSummary {
    private Long id;
    private String title;
    private String acronym;
    private CertificationIssuer issuer;
    private String category;
    private String certificationType;
    private String shortDescription;
    private String startDate;
    private String obtainedDate;
    private String expiryDate;
    private String credentialId;
    private String status;
    private String mention;
    private String verificationLink;
    private String logo;
    private Certification.PublicationStatus publicationStatus;
    private Integer displayOrder;
    private Boolean isVisible;

    public CertificationSummary(Certification cert) {
        this.id = cert.getId();
        this.title = cert.getTitle();
        this.acronym = cert.getAcronym();
        this.issuer = cert.getIssuer();
        this.category = cert.getCategory();
        this.certificationType = cert.getCertificationType();
        this.shortDescription = cert.getShortDescription();
        this.startDate = cert.getStartDate();
        this.obtainedDate = cert.getObtainedDate();
        this.expiryDate = cert.getExpiryDate();
        this.credentialId = cert.getCredentialId();
        this.status = cert.getStatus();
        this.mention = cert.getMention();
        this.verificationLink = cert.getVerificationLink();
        this.logo = cert.getLogo();
        this.publicationStatus = cert.getPublicationStatus();
        this.displayOrder = cert.getDisplayOrder();
        this.isVisible = cert.getIsVisible();
    }
}