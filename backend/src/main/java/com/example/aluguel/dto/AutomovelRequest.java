package com.example.aluguel.dto;

import com.example.aluguel.model.TipoProprietario;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Serdeable
public class AutomovelRequest {

    @NotBlank
    @Size(max = 40)
    private String matricula;

    @NotNull
    @Min(1950)
    @Max(2100)
    private Integer ano;

    @NotBlank
    @Size(max = 80)
    private String marca;

    @NotBlank
    @Size(max = 80)
    private String modelo;

    @NotBlank
    @Size(max = 10)
    private String placa;

    @NotNull
    private TipoProprietario tipoProprietario;

    private Long proprietarioClienteId;
    private Long proprietarioEmpresaId;
    private Long proprietarioBancoId;

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
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
