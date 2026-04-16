package com.example.aluguel.controller;

import com.example.aluguel.dto.ClienteResponse;
import com.example.aluguel.dto.ClienteRegistroRequest;
import com.example.aluguel.dto.RegisterAgenteRequest;
import com.example.aluguel.service.AuthService;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

@Controller("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Post("/register/cliente")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<ClienteResponse> registrarCliente(@Body @Valid ClienteRegistroRequest request) {
        ClienteResponse body = authService.registrarCliente(request);
        return HttpResponse.created(body).header(HttpHeaders.LOCATION, "/api/clientes/" + body.getId());
    }

    @Post("/register/agente")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<Void> registrarAgente(@Body @Valid RegisterAgenteRequest request) {
        authService.registrarAgente(request);
        return HttpResponse.status(HttpStatus.CREATED);
    }
}
