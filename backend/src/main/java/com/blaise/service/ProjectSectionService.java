package com.blaise.service;

import com.blaise.entity.Project;
import com.blaise.entity.ProjectSection;
import com.blaise.repository.ProjectRepository;
import com.blaise.repository.ProjectSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectSectionService {

    private final ProjectSectionRepository sectionRepository;
    private final ProjectRepository projectRepository;

    public ProjectSectionService(ProjectSectionRepository sectionRepository, ProjectRepository projectRepository) {
        this.sectionRepository = sectionRepository;
        this.projectRepository = projectRepository;
    }

    public List<ProjectSection> findByProjectId(Long projectId) {
        return sectionRepository.findByProjectIdOrderByDisplayOrderAsc(projectId);
    }

    public ProjectSection save(ProjectSection section) {
        return sectionRepository.save(section);
    }

    public void delete(Long id) {
        sectionRepository.deleteById(id);
    }

    public void deleteByProjectId(Long projectId) {
        sectionRepository.deleteByProjectId(projectId);
    }

    public void reorderSections(Long projectId, List<Long> sectionIdsInOrder) {
        for (int i = 0; i < sectionIdsInOrder.size(); i++) {
            Long sectionId = sectionIdsInOrder.get(i);
            ProjectSection section = sectionRepository.findById(sectionId)
                    .orElseThrow(() -> new RuntimeException("Section not found: " + sectionId));
            if (!section.getProject().getId().equals(projectId)) {
                throw new RuntimeException("Section does not belong to project");
            }
            section.setDisplayOrder(i);
            sectionRepository.save(section);
        }
    }

    public ProjectSection duplicateSection(Long sectionId) {
        ProjectSection original = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found: " + sectionId));

        ProjectSection copy = new ProjectSection();
        copy.setProject(original.getProject());
        copy.setTitle(original.getTitle() + " (copie)");
        copy.setIcon(original.getIcon());
        copy.setContentType(original.getContentType());
        copy.setContent(original.getContent());
        copy.setDisplayOrder(original.getDisplayOrder() + 1);

        // Shift subsequent sections
        List<ProjectSection> sections = sectionRepository.findByProjectIdOrderByDisplayOrderAsc(original.getProject().getId());
        for (ProjectSection s : sections) {
            if (s.getDisplayOrder() >= copy.getDisplayOrder() && !s.getId().equals(original.getId())) {
                s.setDisplayOrder(s.getDisplayOrder() + 1);
                sectionRepository.save(s);
            }
        }

        return sectionRepository.save(copy);
    }
}