package com.blaise.controller;

import com.blaise.dto.ContactDto;
import com.blaise.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@Valid @RequestBody ContactDto contactDto) {
        try {
            contactService.sendContactEmail(contactDto);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Votre message a bien été envoyé. Merci pour votre prise de contact.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Erreur lors de l'envoi de l'e-mail: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Impossible d'envoyer le message pour le moment. Veuillez réessayer plus tard.");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
