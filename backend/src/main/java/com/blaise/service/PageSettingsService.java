package com.blaise.service;

import com.blaise.entity.PageSettings;
import com.blaise.repository.PageSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PageSettingsService {

    private final PageSettingsRepository repository;

    public PageSettingsService(PageSettingsRepository repository) {
        this.repository = repository;
    }

    // Public endpoint - get page settings by key
    public Optional<PageSettings> findByPageKey(String pageKey) {
        return repository.findByPageKey(pageKey);
    }

    // Admin endpoints
    public List<PageSettings> findAll() {
        return repository.findAllOrderByDisplayOrderAsc();
    }

    public PageSettings findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("PageSettings not found: " + id));
    }

    public PageSettings save(PageSettings entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}