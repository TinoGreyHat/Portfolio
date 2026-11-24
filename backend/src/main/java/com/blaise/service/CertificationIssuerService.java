package com.blaise.service;

import com.blaise.entity.CertificationIssuer;
import com.blaise.repository.CertificationIssuerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CertificationIssuerService {

    private final CertificationIssuerRepository repository;

    public CertificationIssuerService(CertificationIssuerRepository repository) {
        this.repository = repository;
    }

    public List<CertificationIssuer> findAll() {
        return repository.findAllByOrderByNameAsc();
    }

    public CertificationIssuer findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Issuer not found: " + id));
    }

    public CertificationIssuer save(CertificationIssuer entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}