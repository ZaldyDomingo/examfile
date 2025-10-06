package com.socialowl.blog.service;

import com.socialowl.blog.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    private Long id;
    private String email;
    private String name; // ADD THIS FIELD
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    // UPDATE CONSTRUCTOR TO INCLUDE NAME
    public UserPrincipal(Long id, String email, String password, String name,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name; // ADD THIS
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        // FIX: Ensure role has "ROLE_" prefix
        String role = user.getRole();
        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        Collection<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(roleWithPrefix) // USE THE PREFIXED ROLE
        );

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getName(), // ADD USER'S NAME
                authorities);
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    // ADD GETTER FOR NAME
    public String getName() {
        return name;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}