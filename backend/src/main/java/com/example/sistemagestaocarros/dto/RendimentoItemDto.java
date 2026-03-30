package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record RendimentoItemDto(String empregadorNome, Double valor, String descricao) {}
