package com.blaise.service;

import com.blaise.entity.Certification;
import com.blaise.repository.CertificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificationService {
    
    private final CertificationRepository repository;
    
    public CertificationService(CertificationRepository repository) {
        this.repository = repository;
    }
    
    public List<Certification> findAll() {
        return repository.findAll();
    }
    
    public Certification findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Certification not found"));
    }
    
    public Certification save(Certification entity) {
        return repository.save(entity);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
