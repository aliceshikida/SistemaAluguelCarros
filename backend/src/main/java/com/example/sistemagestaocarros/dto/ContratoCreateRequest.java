package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ContratoCreateRequest(
    Integer pedidoId,
    Integer automovelId,
    String tipo,
    String dataInicio,
    String dataFim
) {}
