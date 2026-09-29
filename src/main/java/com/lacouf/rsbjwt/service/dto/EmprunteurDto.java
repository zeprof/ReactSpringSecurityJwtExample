package com.lacouf.rsbjwt.service.dto;

import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.model.auth.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmprunteurDto extends UserDTO {
    private LocalDate since;

    @Builder
    public EmprunteurDto(Long id, String firstName, String lastname, String email, Role role, LocalDate since) {
        super(id, firstName, lastname, email, role);
        this.since = since;
    }

    public EmprunteurDto() {}

    public static EmprunteurDto create(UserApp user) {
        return EmprunteurDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .since(user.getSince())
                .build();
    }
}
