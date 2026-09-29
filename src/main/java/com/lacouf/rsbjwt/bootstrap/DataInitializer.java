package com.lacouf.rsbjwt.bootstrap;

import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.model.auth.Role;
import com.lacouf.rsbjwt.repository.UserAppRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("!test")
public class DataInitializer implements ApplicationRunner {

    private final UserAppRepository userAppRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserAppRepository userAppRepository, PasswordEncoder passwordEncoder) {
        this.userAppRepository = userAppRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userAppRepository.findAll().stream().noneMatch(user -> "l@l.com".equals(user.getEmail()))) {
            userAppRepository.save(
                    UserApp.builder()
                            .firstName("Gerard")
                            .lastName("Biblio")
                            .email("l@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .role(Role.GESTIONNAIRE)
                            .matricule("0000001")
                            .phoneNumber("123-456-7890")
                            .build()
            );
        }

        if (userAppRepository.findAll().stream().noneMatch(user -> "ll@l.com".equals(user.getEmail()))) {
            userAppRepository.save(
                    UserApp.builder()
                            .firstName("Isidor")
                            .lastName("Teurteur")
                            .email("ll@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .role(Role.EMPRUNTEUR)
                            .since(LocalDate.of(2020, 10, 20))
                            .build()
            );
        }

        if (userAppRepository.findAll().stream().noneMatch(user -> "lll@l.com".equals(user.getEmail()))) {
            userAppRepository.save(
                    UserApp.builder()
                            .firstName("Chandeuse")
                            .lastName("Lixor")
                            .email("lll@l.com")
                            .password(passwordEncoder.encode("bib"))
                            .role(Role.PREPOSE)
                            .passeKey("12345")
                            .build()
            );
        }
    }
}
