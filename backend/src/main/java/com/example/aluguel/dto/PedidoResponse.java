package com.example.aluguel.dto;

import com.example.aluguel.model.StatusPedido;
import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.time.LocalDate;

@Serdeable
public class PedidoResponse {

    private Long id;
    private Long clienteId;
    private String clienteNome;
    private Long automovelId;
    private String automovelPlaca;
    private String automovelMarca;
    private String automovelModelo;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private BigDecimal valorEstimado;
    private StatusPedido status;
    private String observacaoCliente;
    private String parecerFinanceiro;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public Long getAutomovelId() {
        return automovelId;
    }

    public void setAutomovelId(Long automovelId) {
        this.automovelId = automovelId;
    }

    public String getAutomovelPlaca() {
        return automovelPlaca;
    }

    public void setAutomovelPlaca(String automovelPlaca) {
        this.automovelPlaca = automovelPlaca;
    }

    public String getAutomovelMarca() {
        return automovelMarca;
    }

    public void setAutomovelMarca(String automovelMarca) {
        this.automovelMarca = automovelMarca;
    }

    public String getAutomovelModelo() {
        return automovelModelo;
    }

    public void setAutomovelModelo(String automovelModelo) {
        this.automovelModelo = automovelModelo;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public BigDecimal getValorEstimado() {
        return valorEstimado;
    }

    public void setValorEstimado(BigDecimal valorEstimado) {
        this.valorEstimado = valorEstimado;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public String getObservacaoCliente() {
        return observacaoCliente;
    }

    public void setObservacaoCliente(String observacaoCliente) {
        this.observacaoCliente = observacaoCliente;
    }

    public String getParecerFinanceiro() {
        return parecerFinanceiro;
    }

    public void setParecerFinanceiro(String parecerFinanceiro) {
        this.parecerFinanceiro = parecerFinanceiro;
    }
}
