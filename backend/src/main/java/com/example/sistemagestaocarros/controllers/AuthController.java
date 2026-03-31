package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.dto.LoginRequest;
import com.example.sistemagestaocarros.dto.LoginResponse;
import com.example.sistemagestaocarros.dto.RegisterClienteRequest;
import com.example.sistemagestaocarros.services.AuthService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;

@Controller("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Post("/login")
    public HttpResponse<LoginResponse> login(@Body LoginRequest req) {
        return HttpResponse.ok(authService.login(req));
    }

    @Post("/register")
    public HttpResponse<Void> register(@Body RegisterClienteRequest req) {
        authService.registerCliente(req);
        return HttpResponse.status(HttpStatus.CREATED);
    }
}
