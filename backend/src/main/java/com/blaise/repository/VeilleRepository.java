package com.blaise.repository;

import com.blaise.entity.Veille;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeilleRepository extends JpaRepository<Veille, Long> {
}
