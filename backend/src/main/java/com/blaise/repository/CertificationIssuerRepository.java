package com.blaise.repository;

import com.blaise.entity.CertificationIssuer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificationIssuerRepository extends JpaRepository<CertificationIssuer, Long> {
    List<CertificationIssuer> findAllByOrderByNameAsc();
}