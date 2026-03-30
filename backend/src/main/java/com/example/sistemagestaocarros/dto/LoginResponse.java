package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record LoginResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    String role,
    String nome,
    Integer usuarioId,
    String tipoAgente
) {}
