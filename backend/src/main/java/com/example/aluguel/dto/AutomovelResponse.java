package com.example.aluguel.dto;

import com.example.aluguel.model.TipoProprietario;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class AutomovelResponse {

    private Long id;
    private String matricula;
    private int ano;
    private String marca;
    private String modelo;
    private String placa;
    private TipoProprietario tipoProprietario;
    private Long proprietarioClienteId;
    private Long proprietarioEmpresaId;
    private Long proprietarioBancoId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public TipoProprietario getTipoProprietario() {
        return tipoProprietario;
    }

    public void setTipoProprietario(TipoProprietario tipoProprietario) {
        this.tipoProprietario = tipoProprietario;
    }

    public Long getProprietarioClienteId() {
        return proprietarioClienteId;
    }

    public void setProprietarioClienteId(Long proprietarioClienteId) {
        this.proprietarioClienteId = proprietarioClienteId;
    }

    public Long getProprietarioEmpresaId() {
        return proprietarioEmpresaId;
    }

    public void setProprietarioEmpresaId(Long proprietarioEmpresaId) {
        this.proprietarioEmpresaId = proprietarioEmpresaId;
    }

    public Long getProprietarioBancoId() {
        return proprietarioBancoId;
    }

    public void setProprietarioBancoId(Long proprietarioBancoId) {
        this.proprietarioBancoId = proprietarioBancoId;
    }
}
