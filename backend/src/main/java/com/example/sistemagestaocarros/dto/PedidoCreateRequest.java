package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record PedidoCreateRequest(Integer automovelId, String observacao) {}
