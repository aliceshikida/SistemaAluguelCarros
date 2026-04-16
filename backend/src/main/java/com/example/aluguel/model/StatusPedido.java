package com.example.aluguel.model;

public enum StatusPedido {
    /** Cliente criou o pedido. */
    SOLICITADO,
    /** Agente iniciou análise financeira. */
    EM_ANALISE_FINANCEIRA,
    /** Parecer financeiro favorável; pode gerar contrato. */
    APROVADO,
    /** Parecer financeiro desfavorável. */
    REPROVADO,
    /** Cancelado pelo cliente. */
    CANCELADO,
    /** Contrato de aluguel registrado para este pedido. */
    CONCLUIDO
}
