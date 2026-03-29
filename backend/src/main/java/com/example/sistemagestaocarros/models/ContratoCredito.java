package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;

@Entity
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCredito;

    private Double valor;
    private Double taxajuros;
    private Integer prazo;

    // NOVO: 1 para 1 voltando para o Contrato
    @OneToOne
    @JoinColumn(name = "contrato_id")
    private Contrato contrato;

    // NOVO: N para 1 com o Banco que concedeu
    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Banco banco;

    public ContratoCredito() {}

    // Getters e Setters antigos...
    public Integer getIdCredito() { return idCredito; }
    public void setIdCredito(Integer idCredito) { this.idCredito = idCredito; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public Double getTaxajuros() { return taxajuros; }
    public void setTaxajuros(Double taxajuros) { this.taxajuros = taxajuros; }
    public Integer getPrazo() { return prazo; }
    public void setPrazo(Integer prazo) { this.prazo = prazo; }

    // Novos Getters e Setters
    public Contrato getContrato() { return contrato; }
    public void setContrato(Contrato contrato) { this.contrato = contrato; }
    public Banco getBanco() { return banco; }
    public void setBanco(Banco banco) { this.banco = banco; }
}