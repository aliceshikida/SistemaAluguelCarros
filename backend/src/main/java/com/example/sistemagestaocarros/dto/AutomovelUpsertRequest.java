package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record AutomovelUpsertRequest(
    String matricula,
    Integer ano,
    String marca,
    String modelo,
    String placa,
    Integer empresaId
) {}
