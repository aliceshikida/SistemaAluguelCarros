package com.example.sistemagestaocarros.security;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.inject.Singleton;

@Singleton
public class PasswordHasher {

    private static final int COST = 10;

    public String hash(String raw) {
        return BCrypt.withDefaults().hashToString(COST, raw.toCharArray());
    }

    public boolean matches(String raw, String hash) {
        return BCrypt.verifyer().verify(raw.toCharArray(), hash).verified;
    }
}
