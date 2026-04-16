package com.example.aluguel.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class PerfilUsuarioResponse {

    /** CLIENTE, EMPRESA ou BANCO */
    private String papel;

    private Long clienteId;
    private Long empresaId;
    private Long bancoId;

    public String getPapel() {
        return papel;
    }

    public void setPapel(String papel) {
        this.papel = papel;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(Long empresaId) {
        this.empresaId = empresaId;
    }

    public Long getBancoId() {
        return bancoId;
    }

    public void setBancoId(Long bancoId) {
        this.bancoId = bancoId;
    }
}
