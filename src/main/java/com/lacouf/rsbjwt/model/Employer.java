package com.lacouf.rsbjwt.model;

import com.lacouf.rsbjwt.model.auth.Role;
import jakarta.persistence.*;


@Entity
@DiscriminatorValue("Emp")
public class Employer extends User{

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "compagnie_id")
    private Company company;

    public Company getCompagnie() {
        return company;
    }

    public void setCompagnie(Company company) {
        this.company = company;
    }

    public Employer(String firstName, String lastName, String email, String password, Role role, Company company) {
        super(firstName, lastName, email, password, role);
        this.company = company;
    }

    public Employer(){}
}
