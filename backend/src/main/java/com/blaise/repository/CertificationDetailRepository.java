package com.blaise.repository;

import com.blaise.entity.CertificationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificationDetailRepository extends JpaRepository<CertificationDetail, Long> {
    List<CertificationDetail> findByCertificationIdOrderByDisplayOrderAsc(Long certificationId);

    void deleteByCertificationId(Long certificationId);
}