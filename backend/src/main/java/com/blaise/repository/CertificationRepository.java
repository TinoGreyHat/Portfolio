package com.blaise.repository;

import com.blaise.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByPublicationStatusOrderByDisplayOrderAsc(Certification.PublicationStatus status);

    List<Certification> findByIsVisibleTrueAndPublicationStatusOrderByDisplayOrderAsc(Certification.PublicationStatus status);

    @Query("SELECT c FROM Certification c WHERE c.isVisible = true AND c.publicationStatus = com.blaise.entity.Certification.PublicationStatus.PUBLISHED ORDER BY c.displayOrder ASC")
    List<Certification> findAllPublishedAndVisible();

    @Query("SELECT c FROM Certification c ORDER BY c.displayOrder ASC")
    List<Certification> findAllOrderByDisplayOrderAsc();

    @Query("SELECT c FROM Certification c " +
           "LEFT JOIN FETCH c.issuer " +
           "WHERE c.id = :id AND c.isVisible = true AND c.publicationStatus = com.blaise.entity.Certification.PublicationStatus.PUBLISHED")
    Optional<Certification> findPublishedWithDetailsById(Long id);
}