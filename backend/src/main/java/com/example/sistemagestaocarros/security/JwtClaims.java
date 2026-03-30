package com.example.sistemagestaocarros.security;

public record JwtClaims(Integer userId, String role, String tipoAgente) {}
