package com.example.sistemagestaocarros.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

@Singleton
public class JwtTokenService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret must be at least 32 bytes for HS256");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
        this.expirationMs = expirationSeconds * 1000;
    }

    public String generate(Integer userId, String role, String tipoAgente) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("role", role)
            .claim("tipoAgente", tipoAgente != null ? tipoAgente : "")
            .issuedAt(now)
            .expiration(exp)
            .signWith(key)
            .compact();
    }

    public JwtClaims parse(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        Integer userId = Integer.parseInt(claims.getSubject());
        String role = claims.get("role", String.class);
        String tipo = claims.get("tipoAgente", String.class);
        if (tipo != null && tipo.isEmpty()) {
            tipo = null;
        }
        return new JwtClaims(userId, role, tipo);
    }
}
