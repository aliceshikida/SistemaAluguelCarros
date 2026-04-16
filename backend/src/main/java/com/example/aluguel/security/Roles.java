package com.example.aluguel.security;

import com.example.aluguel.model.Papel;

public final class Roles {

    public static final String CLIENTE = "ROLE_CLIENTE";
    public static final String EMPRESA = "ROLE_EMPRESA";
    public static final String BANCO = "ROLE_BANCO";

    private Roles() {
    }

    public static String fromPapel(Papel papel) {
        return "ROLE_" + papel.name();
    }
}
