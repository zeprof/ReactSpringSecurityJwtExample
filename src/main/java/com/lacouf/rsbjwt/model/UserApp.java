package com.lacouf.rsbjwt.model;

import com.lacouf.rsbjwt.model.auth.Credentials;
import com.lacouf.rsbjwt.model.auth.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;

@Entity
@Table(name = "user_app")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserApp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Embedded
    private Credentials credentials;

    @Column(unique = true)
    private String matricule;

    private String phoneNumber;
    private String passeKey;
    private LocalDate since;

    @Builder
    public UserApp(Long id, String firstName, String lastName, String email, String password, Role role,
                   String matricule, String phoneNumber, String passeKey, LocalDate since) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.credentials = Credentials.builder()
                .email(email)
                .password(password)
                .role(role)
                .build();
        this.matricule = matricule;
        this.phoneNumber = phoneNumber;
        this.passeKey = passeKey;
        this.since = since;
    }

    public String getEmail() {
        return credentials.getEmail();
    }

    public String getPassword() {
        return credentials.getPassword();
    }

    public Role getRole() {
        return credentials.getRole();
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return credentials.getAuthorities();
    }
}
