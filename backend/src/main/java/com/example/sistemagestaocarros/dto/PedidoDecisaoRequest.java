package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record PedidoDecisaoRequest(String status, String analiseFinanceira) {}
