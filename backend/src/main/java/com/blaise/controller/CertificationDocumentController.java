package com.blaise.controller;

import com.blaise.entity.Certification;
import com.blaise.entity.CertificationDocument;
import com.blaise.service.CertificationDocumentService;
import com.blaise.service.CertificationService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/certifications/{certificationId}/documents")
public class CertificationDocumentController {

    private final CertificationDocumentService documentService;
    private final CertificationService certificationService;

    public CertificationDocumentController(CertificationDocumentService documentService, CertificationService certificationService) {
        this.documentService = documentService;
        this.certificationService = certificationService;
    }

    @GetMapping
    public List<CertificationDocument> getDocuments(@PathVariable Long certificationId) {
        certificationService.findById(certificationId); // Validate certification exists
        return documentService.findByCertificationId(certificationId);
    }

    @PostMapping("/upload")
    public ResponseEntity<CertificationDocument> uploadDocument(
            @PathVariable Long certificationId,
            @RequestParam("file") MultipartFile file) {
        try {
            certificationService.findById(certificationId); // Validate certification exists
            CertificationDocument document = documentService.uploadDocument(certificationId, file);
            return ResponseEntity.ok(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long certificationId,
            @PathVariable Long documentId) {
        try {
            certificationService.findById(certificationId); // Validate certification exists
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete document: " + e.getMessage(), e);
        }
    }

    // Public endpoint to view/download document
    @GetMapping("/{documentId}/view")
    public ResponseEntity<Resource> viewDocument(
            @PathVariable Long certificationId,
            @PathVariable Long documentId) {
        try {
            certificationService.findById(certificationId); // Validate certification exists
            Optional<CertificationDocument> docOpt = documentService.findPublicByCertificationId(certificationId);

            if (docOpt.isEmpty() || !docOpt.get().getId().equals(documentId)) {
                return ResponseEntity.notFound().build();
            }

            CertificationDocument document = docOpt.get();
            Path filePath = documentService.getDocumentPath(documentId);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + document.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Failed to read document: " + e.getMessage(), e);
        }
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long certificationId,
            @PathVariable Long documentId) {
        try {
            certificationService.findById(certificationId); // Validate certification exists
            Optional<CertificationDocument> docOpt = documentService.findPublicByCertificationId(certificationId);

            if (docOpt.isEmpty() || !docOpt.get().getId().equals(documentId)) {
                return ResponseEntity.notFound().build();
            }

            CertificationDocument document = docOpt.get();
            Path filePath = documentService.getDocumentPath(documentId);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Failed to read document: " + e.getMessage(), e);
        }
    }
}