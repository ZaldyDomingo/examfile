package com.socialowl.blog.controller;

import com.socialowl.blog.dto.AuthResponse;
import com.socialowl.blog.dto.LoginRequest;
import com.socialowl.blog.dto.RegisterRequest;
import com.socialowl.blog.dto.UserResponse;
import com.socialowl.blog.entity.User;
import com.socialowl.blog.service.AuthService;
import com.socialowl.blog.service.JwtService;
import com.socialowl.blog.service.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);

            // Auto login after registration
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            registerRequest.getEmail(),
                            registerRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateJwtToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            UserResponse userResponse = new UserResponse(
                    userPrincipal.getId(),
                    userPrincipal.getEmail(),
                    user.getName(),
                    user.getRole());

            return ResponseEntity.ok(new AuthResponse(jwt, userResponse));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateJwtToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            UserResponse userResponse = new UserResponse(
                    userPrincipal.getId(),
                    userPrincipal.getEmail(),
                    userPrincipal.getUsername(), // This will be email, we need to get actual name
                    userPrincipal.getAuthorities().iterator().next().getAuthority());

            return ResponseEntity.ok(new AuthResponse(jwt, userResponse));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}