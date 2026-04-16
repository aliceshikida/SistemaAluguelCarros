package com.example.aluguel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "automovel")
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40)
    private String matricula;

    @Column(nullable = false)
    private int ano;

    @Column(nullable = false, length = 80)
    private String marca;

    @Column(nullable = false, length = 80)
    private String modelo;

    @Column(nullable = false, unique = true, length = 10)
    private String placa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_proprietario", nullable = false, length = 20)
    private TipoProprietario tipoProprietario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietario_cliente_id")
    private Cliente proprietarioCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietario_empresa_id")
    private Empresa proprietarioEmpresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietario_banco_id")
    private Banco proprietarioBanco;

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

    public Cliente getProprietarioCliente() {
        return proprietarioCliente;
    }

    public void setProprietarioCliente(Cliente proprietarioCliente) {
        this.proprietarioCliente = proprietarioCliente;
    }

    public Empresa getProprietarioEmpresa() {
        return proprietarioEmpresa;
    }

    public void setProprietarioEmpresa(Empresa proprietarioEmpresa) {
        this.proprietarioEmpresa = proprietarioEmpresa;
    }

    public Banco getProprietarioBanco() {
        return proprietarioBanco;
    }

    public void setProprietarioBanco(Banco proprietarioBanco) {
        this.proprietarioBanco = proprietarioBanco;
    }
}
