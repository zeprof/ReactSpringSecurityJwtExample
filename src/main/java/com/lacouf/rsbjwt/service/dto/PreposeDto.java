package com.lacouf.rsbjwt.service.dto;

import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.model.auth.Role;
import lombok.Builder;

public class PreposeDto extends UserDTO {
    private String passeKey;

    @Builder
    public PreposeDto(Long id, String firstName, String lastname, String email, Role role, String passeKey) {
        super(id, firstName, lastname, email, role);
        this.passeKey = passeKey;
    }

    public static PreposeDto create(UserApp user) {
        return PreposeDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .passeKey(user.getPasseKey())
                .build();
    }
}
