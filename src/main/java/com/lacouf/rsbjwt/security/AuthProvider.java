package com.lacouf.rsbjwt.security;

import com.lacouf.rsbjwt.repository.UserAppRepository;
import com.lacouf.rsbjwt.model.UserApp;
import com.lacouf.rsbjwt.security.exception.AuthenticationException;
import com.lacouf.rsbjwt.security.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final UserAppRepository userAppRepository;

    @Override
    public Authentication authenticate(Authentication authentication) {
        String email = authentication.getName();
        UserApp user = loadUserByEmail(email);
        validateAuthentication(authentication, user);

        User principal = new User(user.getEmail(), user.getPassword(), user.getAuthorities());
        return new UsernamePasswordAuthenticationToken(
                principal,
                null,
                user.getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }

    private UserApp loadUserByEmail(String email) throws UsernameNotFoundException {
        return userAppRepository.findUserAppByEmail(email)
                .orElseThrow(UserNotFoundException::new);
    }

    private void validateAuthentication(Authentication authentication, UserApp user) {
        Object credentials = authentication.getCredentials();
        if (credentials == null || !passwordEncoder.matches(credentials.toString(), user.getPassword())) {
            throw new AuthenticationException(HttpStatus.FORBIDDEN, "Incorrect username or password");
        }
    }
}
