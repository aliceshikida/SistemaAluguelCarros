package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record PedidoUpdateRequest(Integer automovelId, String observacao, String analiseFinanceira) {}
