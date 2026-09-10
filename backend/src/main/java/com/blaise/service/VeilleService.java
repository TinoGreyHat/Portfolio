package com.blaise.service;

import com.blaise.entity.Veille;
import com.blaise.repository.VeilleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeilleService {
    
    private final VeilleRepository repository;
    
    public VeilleService(VeilleRepository repository) {
        this.repository = repository;
    }
    
    public List<Veille> findAll() {
        return repository.findAll();
    }
    
    public Veille findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Veille not found"));
    }
    
    public Veille save(Veille entity) {
        return repository.save(entity);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
