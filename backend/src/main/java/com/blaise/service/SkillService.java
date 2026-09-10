package com.blaise.service;

import com.blaise.entity.Skill;
import com.blaise.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {
    
    private final SkillRepository repository;
    
    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }
    
    public List<Skill> findAll() {
        return repository.findAll();
    }
    
    public Skill findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));
    }
    
    public Skill save(Skill entity) {
        return repository.save(entity);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
