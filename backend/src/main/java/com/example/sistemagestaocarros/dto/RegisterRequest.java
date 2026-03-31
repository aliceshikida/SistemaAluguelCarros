package com.example.sistemagestaocarros.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public record RegisterRequest(
    String tipoUsuario,
    String tipoAgente,
    String nome,
    String endereco,
    String login,
    String senha,
    String rg,
    String cpf,
    String profissao,
    String nomeFantasia,
    Integer idAgente,
    String cnpj,
    List<RendimentoItemDto> rendimentos
) {}
