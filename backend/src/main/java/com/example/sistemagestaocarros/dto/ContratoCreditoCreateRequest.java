package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ContratoCreditoCreateRequest(
    Integer contratoId,
    Double valor,
    Double taxaJuros,
    Integer prazo
) {}
