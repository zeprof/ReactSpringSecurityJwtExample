package com.lacouf.rsbjwt.service.dto;

import com.lacouf.rsbjwt.model.Company;
import com.lacouf.rsbjwt.model.Employer;
import com.lacouf.rsbjwt.model.auth.Role;

public record EmployerDTO(Long id, String firstname, String lastname, String email, String password, Role role, Company company) {
    public static EmployerDTO of(Employer employe) {
        return new EmployerDTO(employe.getId() , employe.getFirstName() , employe.getLastName() , employe.getEmail() , employe.getPassword() ,employe.getRole(),employe.getCompagnie());
    }
}
