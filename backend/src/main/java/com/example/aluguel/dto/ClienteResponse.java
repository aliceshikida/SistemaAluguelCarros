package com.example.aluguel.dto;

import io.micronaut.serde.annotation.Serdeable;

import java.util.List;

@Serdeable
public class ClienteResponse {

    private Long id;
    private Long usuarioId;
    private String login;
    private String nome;
    private String cpf;
    private String rg;
    private String endereco;
    private String profissao;
    private List<EmpregadorItemDto> empregadores;
    private List<RendimentoItemDto> rendimentos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<EmpregadorItemDto> getEmpregadores() {
        return empregadores;
    }

    public void setEmpregadores(List<EmpregadorItemDto> empregadores) {
        this.empregadores = empregadores;
    }

    public List<RendimentoItemDto> getRendimentos() {
        return rendimentos;
    }

    public void setRendimentos(List<RendimentoItemDto> rendimentos) {
        this.rendimentos = rendimentos;
    }
}
