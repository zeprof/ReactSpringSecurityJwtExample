package com.lacouf.rsbjwt;

import com.lacouf.rsbjwt.model.Emprunteur;
import com.lacouf.rsbjwt.model.EmprunteurRepository;
import com.lacouf.rsbjwt.model.Gestionnaire;
import com.lacouf.rsbjwt.model.GestionnaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@SpringBootApplication
public class ReactSpringSecurityJwtApplication implements CommandLineRunner {

    private final GestionnaireRepository gestionnaireRepository;
    private final EmprunteurRepository emprunteurRepository;

    private final PasswordEncoder passwordEncoder;

    public ReactSpringSecurityJwtApplication(GestionnaireRepository gestionnaireRepository, EmprunteurRepository emprunteurRepository, PasswordEncoder passwordEncoder) {
        this.gestionnaireRepository = gestionnaireRepository;
        this.emprunteurRepository = emprunteurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(ReactSpringSecurityJwtApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        gestionnaireRepository.save(
                Gestionnaire.builder()
                        .firstName("Gerant")
                        .lastName("Biblio")
                        .email("gerantbiblio@gmail.com")
                        .password(passwordEncoder.encode("bibliopassword"))
                        .matricule("0000001")
                        .phoneNumber("123-456-7890")
                        .build()
        );
        emprunteurRepository.save(
                Emprunteur.builder()
                        .firstName("empru")
                        .lastName("nteur")
                        .email("emprunteurbiblio@gmail.com")
                        .password(passwordEncoder.encode("bibliopassword"))
                        .since(LocalDate.of(2020, 10,20))
                        .build()
        );
    }
}
