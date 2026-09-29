package com.lacouf.rsbjwt.presentation;

import com.lacouf.rsbjwt.security.exception.AuthenticationException;
import com.lacouf.rsbjwt.service.UserAppService;
import com.lacouf.rsbjwt.service.dto.JWTAuthResponse;
import com.lacouf.rsbjwt.service.dto.LoginDTO;
import com.lacouf.rsbjwt.service.dto.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

	private final UserAppService userService;

	@PostMapping("/login")
	public ResponseEntity<JWTAuthResponse> authenticateUser(@RequestBody @Valid LoginDTO loginDto) {
		try {
			String accessToken = userService.authenticateUser(loginDto);
			JWTAuthResponse authResponse = new JWTAuthResponse(accessToken);
			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_JSON)
					.body(authResponse);
		} catch (Exception e) {
			throw new AuthenticationException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
		}
	}

	@GetMapping("/me")
	public ResponseEntity<UserDTO> getMe(HttpServletRequest request) {
		String authorization = request.getHeader("Authorization");
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_JSON)
				.body(userService.getMe(authorization));
	}

	@GetMapping("/gestionnaire/demo")
	@PreAuthorize("hasAuthority('GESTIONNAIRE')")
	public ResponseEntity<String> gestionnaireDemoEndpoint() {
		return ResponseEntity.ok("tout est beau");
	}

}
