package com.blaise.repository;

import com.blaise.entity.PageSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PageSettingsRepository extends JpaRepository<PageSettings, Long> {

    Optional<PageSettings> findByPageKey(String pageKey);

    @Query("SELECT p FROM PageSettings p ORDER BY p.displayOrder ASC")
    List<PageSettings> findAllOrderByDisplayOrderAsc();
}