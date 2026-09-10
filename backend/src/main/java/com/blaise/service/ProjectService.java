package com.blaise.service;

import com.blaise.entity.Project;
import com.blaise.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    
    private final ProjectRepository repository;
    
    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }
    
    public List<Project> findAll() {
        return repository.findAll();
    }
    
    public Project findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }
    
    public Project save(Project entity) {
        return repository.save(entity);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
