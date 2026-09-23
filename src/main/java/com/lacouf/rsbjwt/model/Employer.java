package com.lacouf.rsbjwt.model;

import com.lacouf.rsbjwt.model.auth.Role;
import jakarta.persistence.*;


@Entity
@DiscriminatorValue("Emp")
public class Employer extends User{

    @Column(name = "compagnie_id")
    private Long compagnieId;

    public Employer(String name, String surname, String email, String password, Role role, Long compagnieId) {
        super(name, surname, email, password, role);
        this.compagnieId = compagnieId;
    }

    public void setCompagnieId(Long compagnieId) {
        this.compagnieId = compagnieId;
    }

    public Long getCompagnieId() {
        return compagnieId;
    }

    public Employer(){}
}