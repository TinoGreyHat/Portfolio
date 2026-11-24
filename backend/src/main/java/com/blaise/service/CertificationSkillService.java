package com.blaise.service;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationSkill;
import com.blaise.repository.CertificationRepository;
import com.blaise.repository.CertificationSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CertificationSkillService {

    private final CertificationSkillRepository skillRepository;
    private final CertificationRepository certificationRepository;

    public CertificationSkillService(CertificationSkillRepository skillRepository, CertificationRepository certificationRepository) {
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
    }

    public List<CertificationSkill> findByCertificationId(Long certificationId) {
        return skillRepository.findByCertificationIdOrderByDisplayOrderAsc(certificationId);
    }

    public CertificationSkill save(CertificationSkill skill) {
        if (skill.getCertification() != null && skill.getCertification().getId() != null) {
            Certification cert = certificationRepository.findById(skill.getCertification().getId())
                    .orElseThrow(() -> new RuntimeException("Certification not found: " + skill.getCertification().getId()));
            skill.setCertification(cert);
        }
        return skillRepository.save(skill);
    }

    public void delete(Long id) {
        skillRepository.deleteById(id);
    }

    public void deleteByCertificationId(Long certificationId) {
        skillRepository.deleteByCertificationId(certificationId);
    }

    public void reorderSkills(Long certificationId, List<Long> skillIdsInOrder) {
        for (int i = 0; i < skillIdsInOrder.size(); i++) {
            Long skillId = skillIdsInOrder.get(i);
            CertificationSkill skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new RuntimeException("Skill not found: " + skillId));
            if (!skill.getCertification().getId().equals(certificationId)) {
                throw new RuntimeException("Skill does not belong to certification");
            }
            skill.setDisplayOrder(i);
            skillRepository.save(skill);
        }
    }
}