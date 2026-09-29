package com.lacouf.rsbjwt.service.dto;

import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.model.auth.Role;
import lombok.Builder;

public class GestionnaireDto extends UserDTO {
    private String matricule;
    private String phoneNumber;

    @Builder
    public GestionnaireDto(Long id, String firstName, String lastname,
                           String email, Role role, String matricule, String phoneNumber) {
        super(id, firstName, lastname, email, role);
        this.matricule = matricule;
        this.phoneNumber = phoneNumber;
    }

    public GestionnaireDto() {}

    public static GestionnaireDto create(UserApp user) {
        return GestionnaireDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .matricule(user.getMatricule())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
