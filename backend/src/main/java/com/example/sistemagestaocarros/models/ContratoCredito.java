package com.example.sistemagestaocarros.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCredito;

    private Double valor;
    private Double taxajuros;
    private Integer prazo;

    /** PENDENTE, ATIVO, REJEITADO, CANCELADO */
    private String status;

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Novos Getters e Setters
    @JsonIgnore
    public Contrato getContrato() { return contrato; }
    public void setContrato(Contrato contrato) { this.contrato = contrato; }

    public Integer getContratoId() {
        return contrato != null ? contrato.getIdContrato() : null;
    }
    public Banco getBanco() { return banco; }
    public void setBanco(Banco banco) { this.banco = banco; }
}