package com.lacouf.rsbjwt.presentation;

import com.lacouf.rsbjwt.model.auth.Role;
import com.lacouf.rsbjwt.service.EmployerService;
import com.lacouf.rsbjwt.service.dto.CompanyDTO;
import com.lacouf.rsbjwt.service.dto.EmployerDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeController.class)
@WithMockUser
public class EmployeControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EmployerService employerService;

    @Test
    public void addCompagnie_returnsCreatedWithDTO() throws Exception {
        when(employerService.addCompagnie("NovaPlus", "Montreal"))
                .thenReturn(new CompanyDTO(1L, "NovaPlus", "Montreal"));
        String request =
                """
                {
                    "companyName": "NovaPlus",
                    "city": "Montreal"
                }
                """;

        this.mockMvc
                .perform(
                        post("/employe/compagnie")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.compagniName").value("NovaPlus"))
                .andExpect(jsonPath("$.city").value("Montreal"));

        verify(employerService).addCompagnie("NovaPlus", "Montreal");
    }

    @Test
    public void addEmploye_returnsCreatedWithDTO() throws Exception {
        when(employerService.addEmploye(anyString(), anyString(), anyString(), anyString(), any(Role.class), eq(5L)))
                .thenReturn(new EmployerDTO(1L, "Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, 5L));
        String request =
                """
                {
                    "firstname": "Brahim",
                    "lastname": "Test",
                    "email": "brahim@test.com",
                    "password": "password",
                    "role": "ROLE_EMPLOYER",
                    "compagnieId": 5
                }
                """;

        this.mockMvc
                .perform(
                        post("/employe")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstname").value("Brahim"))
                .andExpect(jsonPath("$.email").value("brahim@test.com"))
                .andExpect(jsonPath("$.role").value("ROLE_EMPLOYER"))
                .andExpect(jsonPath("$.compagnieId").value(5));

        verify(employerService).addEmploye("Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, 5L);
    }

    @Test
    public void addEmploye_withoutCompagnie_passesNullCompagnieId() throws Exception {
        String request =
                """
                {
                    "firstname": "Brahim",
                    "lastname": "Test",
                    "email": "brahim@test.com",
                    "password": "password",
                    "role": "ROLE_EMPLOYER"
                }
                """;

        this.mockMvc
                .perform(
                        post("/employe")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isCreated());

        verify(employerService).addEmploye("Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, null);
    }

    @Test
    public void addEmploye_invalidRole_returnsBadRequest() throws Exception {
        String request =
                """
                {
                    "firstname": "Brahim",
                    "lastname": "Test",
                    "email": "brahim@test.com",
                    "password": "password",
                    "role": "NOT_A_ROLE",
                    "compagnieId": 5
                }
                """;

        this.mockMvc
                .perform(
                        post("/employe")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    public void getEmploye_returnsOkWithDTO() throws Exception {
        when(employerService.findEmployeBy_Id(1L))
                .thenReturn(new EmployerDTO(1L, "Brahim", "Test", "brahim@test.com", "password", Role.EMPLOYER, 3L));

        this.mockMvc
                .perform(get("/employe/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstname").value("Brahim"))
                .andExpect(jsonPath("$.lastname").value("Test"))
                .andExpect(jsonPath("$.compagnieId").value(3));

        verify(employerService).findEmployeBy_Id(1L);
    }
}
