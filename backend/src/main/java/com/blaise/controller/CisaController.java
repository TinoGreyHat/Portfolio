package com.blaise.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/cve")
public class CisaController {

    private final RestTemplate restTemplate;

    public CisaController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/cisa")
    public ResponseEntity<String> getCisaVulnerabilities() {
        String cisaUrl = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
        try {
            String response = restTemplate.getForObject(cisaUrl, String.class);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(502).body("{\"error\": \"Unable to fetch data from CISA API.\"}");
        }
    }
}