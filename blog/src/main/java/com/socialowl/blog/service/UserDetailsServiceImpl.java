package com.socialowl.blog.service;

import com.socialowl.blog.entity.User;
import com.socialowl.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        return UserPrincipal.create(user);
    }

    // If the UserPrincipal.create method doesn't set authorities properly, use
    // this instead yu dumbass:
    /*
     * @Override
     * 
     * @Transactional
     * public UserDetails loadUserByUsername(String email) throws
     * UsernameNotFoundException {
     * User user = userRepository.findByEmail(email)
     * .orElseThrow(() -> new
     * UsernameNotFoundException("User Not Found with email: " + email));
     * 
     * // Create authorities from user role
     * Collection<? extends GrantedAuthority> authorities =
     * Collections.singletonList(
     * new SimpleGrantedAuthority("ROLE_" + user.getRole())
     * );
     * 
     * return new UserPrincipal(
     * user.getId(),
     * user.getEmail(),
     * user.getPasswordHash(),
     * user.getName(),
     * authorities
     * );
     * }
     */
}