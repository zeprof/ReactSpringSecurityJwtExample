package com.lacouf.rsbjwt.bootstrap;

import com.lacouf.rsbjwt.model.Emprunteur;
import com.lacouf.rsbjwt.model.Gestionnaire;
import com.lacouf.rsbjwt.model.Prepose;
import com.lacouf.rsbjwt.repository.EmprunteurRepository;
import com.lacouf.rsbjwt.repository.GestionnaireRepository;
import com.lacouf.rsbjwt.repository.PreposeRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("!test")
public class DataInitializer implements ApplicationRunner {

    private final GestionnaireRepository gestionnaireRepository;
    private final EmprunteurRepository emprunteurRepository;
    private final PreposeRepository preposeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            GestionnaireRepository gestionnaireRepository,
            EmprunteurRepository emprunteurRepository,
            PreposeRepository preposeRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.gestionnaireRepository = gestionnaireRepository;
        this.emprunteurRepository = emprunteurRepository;
        this.preposeRepository = preposeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (gestionnaireRepository.count() == 0) {
            gestionnaireRepository.save(
                    Gestionnaire.builder()
                            .firstName("Gerard")
                            .lastName("Biblio")
                            .email("l@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .matricule("0000001")
                            .phoneNumber("123-456-7890")
                            .build()
            );
        }

        if (emprunteurRepository.count() == 0) {
            emprunteurRepository.save(
                    Emprunteur.builder()
                            .firstName("Isidor")
                            .lastName("Teurteur")
                            .email("ll@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .since(LocalDate.of(2020, 10, 20))
                            .build()
            );
        }

        if (preposeRepository.count() == 0) {
            preposeRepository.save(
                    Prepose.builder()
                            .firstName("Chandeuse")
                            .lastName("Lixor")
                            .email("lll@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .passeKey("12345")
                            .build()
            );
        }
    }
}
