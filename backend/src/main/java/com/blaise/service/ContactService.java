package com.blaise.service;

import com.blaise.dto.ContactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.to}")
    private String mailTo;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendContactEmail(ContactDto contactDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromEmail != null && !fromEmail.trim().isEmpty()) {
            message.setFrom(fromEmail);
        }
        message.setTo(mailTo);
        message.setReplyTo(contactDto.getEmail());
        message.setSubject("Nouveau message depuis le portfolio : " + contactDto.getSubject());
        
        String text = String.format(
            "Nouveau message depuis le portfolio TinoGreyHat\n\n" +
            "Nom : %s\n" +
            "Email : %s\n" +
            "Sujet : %s\n\n" +
            "Message :\n%s",
            contactDto.getName(),
            contactDto.getEmail(),
            contactDto.getSubject(),
            contactDto.getMessage()
        );
        
        message.setText(text);
        
        mailSender.send(message);
    }
}
