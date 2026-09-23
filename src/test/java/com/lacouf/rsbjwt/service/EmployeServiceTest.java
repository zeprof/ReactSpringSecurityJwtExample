package com.lacouf.rsbjwt.service;

import com.lacouf.rsbjwt.model.Company;
import com.lacouf.rsbjwt.model.Employer;
import com.lacouf.rsbjwt.model.auth.Role;
import com.lacouf.rsbjwt.repository.CompagnyRepo;
import com.lacouf.rsbjwt.repository.EmployerRepo;
import com.lacouf.rsbjwt.service.EmployerService;
import com.lacouf.rsbjwt.service.dto.CompanyDTO;
import com.lacouf.rsbjwt.service.dto.EmployerDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmployeServiceTest {

    @Mock
    private EmployerRepo employerRepo;

    @Mock
    private CompagnyRepo compagnyRepo;

    @InjectMocks
    private EmployerService employerService;

    @Test
    public void addCompagnie_savesAndReturnsDTO() {
        when(compagnyRepo.save(any(Company.class))).thenAnswer(inv -> inv.getArgument(0));

        CompanyDTO result = employerService.addCompagnie("NovaPlus", "Montreal");

        ArgumentCaptor<Company> captor = ArgumentCaptor.forClass(Company.class);
        verify(compagnyRepo).save(captor.capture());
        assertEquals("NovaPlus", captor.getValue().getCompagniName());
        assertEquals("Montreal", captor.getValue().getCity());
        assertEquals("NovaPlus", result.compagniName());
        assertEquals("Montreal", result.city());
    }

    @Test
    public void addEmploye_withCompagnie_savesEmployerWithCompagnieId() {
        when(employerRepo.save(any(Employer.class))).thenAnswer(inv -> inv.getArgument(0));

        EmployerDTO result = employerService.addEmploye(
                "Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, 5L);

        ArgumentCaptor<Employer> captor = ArgumentCaptor.forClass(Employer.class);
        verify(employerRepo).save(captor.capture());
        assertEquals(5L, captor.getValue().getCompagnieId());
        assertEquals("Brahim", result.firstname());
        assertEquals("Test", result.lastname());
        assertEquals("brahim@test.com", result.email());
        assertEquals(Role.EMPLOYER, result.role());
        assertEquals(5L, result.compagnieId());
    }

    @Test
    public void addEmploye_withoutCompagnie_compagnieIdIsNull() {
        when(employerRepo.save(any(Employer.class))).thenAnswer(inv -> inv.getArgument(0));

        EmployerDTO result = employerService.addEmploye(
                "Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, null);

        ArgumentCaptor<Employer> captor = ArgumentCaptor.forClass(Employer.class);
        verify(employerRepo).save(captor.capture());
        assertNull(captor.getValue().getCompagnieId());
        assertNull(result.compagnieId());
    }

    @Test
    public void addEmploye_alwaysForcesEmployerRole() {
        when(employerRepo.save(any(Employer.class))).thenAnswer(inv -> inv.getArgument(0));

        EmployerDTO result = employerService.addEmploye(
                "Brahim", "Test", "brahim@test.com", "password", Role.STUDENT, 1L);

        assertEquals(Role.EMPLOYER, result.role());
    }

    @Test
    public void findEmployeBy_Id_returnsDTO() {
        Employer employer = new Employer(
                "Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, 3L);
        when(employerRepo.findEmployeById(1L)).thenReturn(employer);

        EmployerDTO result = employerService.findEmployeBy_Id(1L);

        assertEquals("Brahim", result.firstname());
        assertEquals("brahim@test.com", result.email());
        assertEquals(3L, result.compagnieId());
    }
}