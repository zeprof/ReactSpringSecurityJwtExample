package com.lacouf.rsbjwt.service;

import com.lacouf.rsbjwt.model.Company;
import com.lacouf.rsbjwt.model.Employer;
import com.lacouf.rsbjwt.model.auth.Role;
import com.lacouf.rsbjwt.repository.CompagnyRepo;
import com.lacouf.rsbjwt.repository.EmployerRepo;
import com.lacouf.rsbjwt.service.dto.CompanyDTO;
import com.lacouf.rsbjwt.service.dto.EmployerDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployerService {

    private EmployerRepo employerRepo;
    private CompagnyRepo compagnyRepo;

    public EmployerService(EmployerRepo employerRepo, CompagnyRepo compagnyRepo){
        this.employerRepo = employerRepo;
        this.compagnyRepo = compagnyRepo;
    }

    @Transactional
    public CompanyDTO addCompagnie(String compagniName, String city){
        return CompanyDTO.of(compagnyRepo.save(new Company(compagniName, city)));
    }

    @Transactional
    public EmployerDTO addEmploye(String firstname, String lastname, String email, String password, Role role, Long compagnieId){
        Employer employe = new Employer(firstname , lastname , email , password , Role.EMPLOYER , compagnieId);
        return EmployerDTO.of(employerRepo.save(employe));
    }

    @Transactional
    public EmployerDTO findEmployeBy_Id(Long id){
        return EmployerDTO.of(employerRepo.findEmployeById(id));
    }
}