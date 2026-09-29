package com.lacouf.rsbjwt.service;

import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.repository.UserAppRepository;
import com.lacouf.rsbjwt.security.JwtTokenProvider;
import com.lacouf.rsbjwt.security.exception.UserNotFoundException;
import com.lacouf.rsbjwt.service.dto.EmprunteurDto;
import com.lacouf.rsbjwt.service.dto.GestionnaireDto;
import com.lacouf.rsbjwt.service.dto.LoginDTO;
import com.lacouf.rsbjwt.service.dto.PreposeDto;
import com.lacouf.rsbjwt.service.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAppService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserAppRepository userAppRepository;

    public String authenticateUser(LoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        return jwtTokenProvider.generateToken(authentication);
    }

    public UserDTO getMe(String token) {
        String jwt = extractToken(token);
        String email = jwtTokenProvider.getEmailFromJWT(jwt);
        UserApp user = userAppRepository.findUserAppByEmail(email).orElseThrow(UserNotFoundException::new);

        return switch (user.getRole()) {
            case EMPRUNTEUR -> EmprunteurDto.create(user);
            case PREPOSE -> PreposeDto.create(user);
            case GESTIONNAIRE -> GestionnaireDto.create(user);
        };
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null) {
            throw new UserNotFoundException();
        }
        if (authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return authorizationHeader;
    }
}
