package com.blaise.service;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationDetail;
import com.blaise.repository.CertificationDetailRepository;
import com.blaise.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CertificationDetailService {

    private final CertificationDetailRepository detailRepository;
    private final CertificationRepository certificationRepository;

    public CertificationDetailService(CertificationDetailRepository detailRepository, CertificationRepository certificationRepository) {
        this.detailRepository = detailRepository;
        this.certificationRepository = certificationRepository;
    }

    public List<CertificationDetail> findByCertificationId(Long certificationId) {
        return detailRepository.findByCertificationIdOrderByDisplayOrderAsc(certificationId);
    }

    public CertificationDetail save(CertificationDetail detail) {
        if (detail.getCertification() != null && detail.getCertification().getId() != null) {
            Certification cert = certificationRepository.findById(detail.getCertification().getId())
                    .orElseThrow(() -> new RuntimeException("Certification not found: " + detail.getCertification().getId()));
            detail.setCertification(cert);
        }
        return detailRepository.save(detail);
    }

    public void delete(Long id) {
        detailRepository.deleteById(id);
    }

    public void deleteByCertificationId(Long certificationId) {
        detailRepository.deleteByCertificationId(certificationId);
    }

    public void reorderDetails(Long certificationId, List<Long> detailIdsInOrder) {
        for (int i = 0; i < detailIdsInOrder.size(); i++) {
            Long detailId = detailIdsInOrder.get(i);
            CertificationDetail detail = detailRepository.findById(detailId)
                    .orElseThrow(() -> new RuntimeException("Detail not found: " + detailId));
            if (!detail.getCertification().getId().equals(certificationId)) {
                throw new RuntimeException("Detail does not belong to certification");
            }
            detail.setDisplayOrder(i);
            detailRepository.save(detail);
        }
    }

    public CertificationDetail duplicateDetail(Long detailId) {
        CertificationDetail original = detailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Detail not found: " + detailId));

        CertificationDetail copy = new CertificationDetail();
        copy.setCertification(original.getCertification());
        copy.setTitle(original.getTitle() + " (copie)");
        copy.setIcon(original.getIcon());
        copy.setContentType(original.getContentType());
        copy.setContent(original.getContent());
        copy.setDisplayOrder(original.getDisplayOrder() + 1);

        // Shift subsequent details
        List<CertificationDetail> details = detailRepository.findByCertificationIdOrderByDisplayOrderAsc(original.getCertification().getId());
        for (CertificationDetail d : details) {
            if (d.getDisplayOrder() >= copy.getDisplayOrder() && !d.getId().equals(original.getId())) {
                d.setDisplayOrder(d.getDisplayOrder() + 1);
                detailRepository.save(d);
            }
        }

        return detailRepository.save(copy);
    }
}