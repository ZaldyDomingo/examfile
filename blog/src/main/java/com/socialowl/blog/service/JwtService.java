// package com.socialowl.blog.service;

// import io.jsonwebtoken.*;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Service;

// import java.util.Date;

// @Service
// public class JwtService {

//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     @Value("${jwt.expiration}")
//     private int jwtExpirationMs;

//     public String generateJwtToken(Authentication authentication) {
//         UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

//         return Jwts.builder()
//                 .setSubject((userPrincipal.getEmail()))
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
//                 .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                 .compact();
//     }

//     public String getEmailFromJwtToken(String token) {
//         return Jwts.parser()
//                 .setSigningKey(jwtSecret)
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     public boolean validateJwtToken(String authToken) {
//         try {
//             Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
//             return true;
//         } catch (SignatureException e) {
//             // log error
//         } catch (MalformedJwtException e) {
//             // log error
//         } catch (ExpiredJwtException e) {
//             // log error
//         } catch (UnsupportedJwtException e) {
//             // log error
//         } catch (IllegalArgumentException e) {
//             // log error
//         }
//         return false;
//     }
// }

package com.socialowl.blog.service;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // GET AUTHORITIES FROM AUTHENTICATION
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject((userPrincipal.getEmail()))
                .claim("id", userPrincipal.getId())
                .claim("name", userPrincipal.getName()) // ADD NAME
                .claim("authorities", authorities) // ADD AUTHORITIES - THIS IS CRITICAL!
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}