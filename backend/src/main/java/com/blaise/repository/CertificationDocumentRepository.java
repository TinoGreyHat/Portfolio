package com.blaise.repository;

import com.blaise.entity.CertificationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificationDocumentRepository extends JpaRepository<CertificationDocument, Long> {
    List<CertificationDocument> findByCertificationId(Long certificationId);

    Optional<CertificationDocument> findByCertificationIdAndIsPublicTrue(Long certificationId);

    void deleteByCertificationId(Long certificationId);
}