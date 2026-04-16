package com.example.aluguel.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Serdeable
public class ClienteUpdateRequest {

    @NotBlank
    @Size(max = 120)
    private String nome;

    @NotBlank
    @Size(max = 20)
    private String rg;

    @NotBlank
    @Size(max = 200)
    private String endereco;

    @NotBlank
    @Size(max = 80)
    private String profissao;

    @Valid
    @Size(max = 3)
    private List<RendimentoItemDto> rendimentos = new ArrayList<>();

    @Valid
    private List<EmpregadorItemDto> empregadores = new ArrayList<>();

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public List<RendimentoItemDto> getRendimentos() {
        return rendimentos;
    }

    public void setRendimentos(List<RendimentoItemDto> rendimentos) {
        this.rendimentos = rendimentos;
    }

    public List<EmpregadorItemDto> getEmpregadores() {
        return empregadores;
    }

    public void setEmpregadores(List<EmpregadorItemDto> empregadores) {
        this.empregadores = empregadores;
    }
}
