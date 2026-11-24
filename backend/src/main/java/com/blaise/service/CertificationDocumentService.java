package com.blaise.service;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationDocument;
import com.blaise.repository.CertificationDocumentRepository;
import com.blaise.repository.CertificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CertificationDocumentService {

    private final CertificationDocumentRepository documentRepository;
    private final CertificationRepository certificationRepository;

    @Value("${app.upload.dir:uploads/certifications}")
    private String uploadDir;

    @Value("${app.upload.max-size:10485760}") // 10MB default
    private long maxFileSize;

    public CertificationDocumentService(CertificationDocumentRepository documentRepository, CertificationRepository certificationRepository) {
        this.documentRepository = documentRepository;
        this.certificationRepository = certificationRepository;
    }

    public List<CertificationDocument> findByCertificationId(Long certificationId) {
        return documentRepository.findByCertificationId(certificationId);
    }

    public Optional<CertificationDocument> findPublicByCertificationId(Long certificationId) {
        return documentRepository.findByCertificationIdAndIsPublicTrue(certificationId);
    }

    public CertificationDocument uploadDocument(Long certificationId, MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum allowed size of " + maxFileSize + " bytes");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("File must have .pdf extension");
        }

        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String storedFileName = UUID.randomUUID().toString() + ".pdf";
        Path filePath = uploadPath.resolve(storedFileName);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        // Create document entity
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Certification not found: " + certificationId));

        CertificationDocument document = new CertificationDocument();
        document.setCertification(cert);
        document.setFileName(originalFilename);
        document.setStoredFileName(storedFileName);
        document.setContentType(contentType);
        document.setFileSize(file.getSize());
        document.setFilePath(uploadDir + "/" + storedFileName);
        document.setIsPublic(true);

        return documentRepository.save(document);
    }

    public void deleteDocument(Long documentId) throws IOException {
        CertificationDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));

        // Delete physical file
        Path filePath = Paths.get(document.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        documentRepository.deleteById(documentId);
    }

    public void deleteByCertificationId(Long certificationId) throws IOException {
        List<CertificationDocument> documents = documentRepository.findByCertificationId(certificationId);
        for (CertificationDocument doc : documents) {
            Path filePath = Paths.get(doc.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        }
        documentRepository.deleteByCertificationId(certificationId);
    }

    public Path getDocumentPath(Long documentId) {
        CertificationDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));
        return Paths.get(document.getFilePath());
    }
}