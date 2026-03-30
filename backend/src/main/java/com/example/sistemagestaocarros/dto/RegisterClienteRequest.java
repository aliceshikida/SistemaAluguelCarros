package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public record RegisterClienteRequest(
    String nome,
    String endereco,
    String login,
    String senha,
    String rg,
    String cpf,
    String profissao,
    List<RendimentoItemDto> rendimentos
) {}
