package com.example.aluguel.controller;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.util.Map;

@Controller
@Secured(SecurityRule.IS_ANONYMOUS)
public class HomeController {

    @Get
    public Map<String, Object> index() {
        return Map.of(
            "nome", "Sistema de Aluguel de Carros",
            "endpoints", "/api/auth, /api/me, /api/clientes, /api/automoveis, /api/pedidos, /api/contratos",
            "documentacao", "README.md na raiz do repositório"
        );
    }
}
