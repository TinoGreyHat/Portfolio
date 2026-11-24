package com.blaise.service;

import com.blaise.dto.CertificationSummary;
import com.blaise.entity.Certification;
import com.blaise.entity.CertificationDetail;
import com.blaise.entity.CertificationDocument;
import com.blaise.entity.CertificationSkill;
import com.blaise.repository.CertificationDetailRepository;
import com.blaise.repository.CertificationDocumentRepository;
import com.blaise.repository.CertificationRepository;
import com.blaise.repository.CertificationSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificationService {

    private final CertificationRepository repository;
    private final CertificationSkillRepository skillRepository;
    private final CertificationDetailRepository detailRepository;
    private final CertificationDocumentRepository documentRepository;

    public CertificationService(CertificationRepository repository,
                                CertificationSkillRepository skillRepository,
                                CertificationDetailRepository detailRepository,
                                CertificationDocumentRepository documentRepository) {
        this.repository = repository;
        this.skillRepository = skillRepository;
        this.detailRepository = detailRepository;
        this.documentRepository = documentRepository;
    }

    // Public endpoint - only published and visible certifications
    public List<CertificationSummary> findAllPublished() {
        return repository.findAllPublishedAndVisible().stream()
                .map(CertificationSummary::new)
                .collect(Collectors.toList());
    }

    // Public endpoint - single certification with all related data
    @Transactional(readOnly = true)
    public Optional<Certification> findPublishedWithDetailsById(Long id) {
        Optional<Certification> certOpt = repository.findPublishedWithDetailsById(id);
        if (certOpt.isPresent()) {
            populateDetails(certOpt.get());
        }
        return certOpt;
    }

    private void populateDetails(Certification cert) {
        Long certId = cert.getId();

        // Load skills
        List<CertificationSkill> skills = skillRepository.findByCertificationIdOrderByDisplayOrderAsc(certId);
        cert.getSkills().clear();
        cert.getSkills().addAll(skills);

        // Load details
        List<CertificationDetail> details = detailRepository.findByCertificationIdOrderByDisplayOrderAsc(certId);
        cert.getDetails().clear();
        cert.getDetails().addAll(details);

        // Load documents
        List<CertificationDocument> documents = documentRepository.findByCertificationId(certId);
        cert.getDocuments().clear();
        cert.getDocuments().addAll(documents);
    }

    // Admin endpoints
    public List<Certification> findAll() {
        return repository.findAllOrderByDisplayOrderAsc();
    }

    @Transactional(readOnly = true)
    public List<Certification> findAllWithFilters(String status, Certification.PublicationStatus publicationStatus, Boolean isVisible) {
        // For now, return all and let frontend filter, or implement custom query
        List<Certification> certifications = repository.findAllOrderByDisplayOrderAsc();
        // Initialize LAZY collections to avoid serialization issues
        certifications.forEach(this::populateDetails);
        return certifications;
    }

    public Certification findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Certification not found: " + id));
    }

    public Certification save(Certification entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void reorderCertifications(List<Long> certificationIdsInOrder) {
        for (int i = 0; i < certificationIdsInOrder.size(); i++) {
            Long certId = certificationIdsInOrder.get(i);
            Certification cert = repository.findById(certId)
                    .orElseThrow(() -> new RuntimeException("Certification not found: " + certId));
            cert.setDisplayOrder(i);
            repository.save(cert);
        }
    }

    public Certification updatePublicationStatus(Long id, Certification.PublicationStatus status) {
        Certification cert = findById(id);
        cert.setPublicationStatus(status);
        return repository.save(cert);
    }

    public Certification updateVisibility(Long id, Boolean isVisible) {
        Certification cert = findById(id);
        cert.setIsVisible(isVisible);
        return repository.save(cert);
    }
}