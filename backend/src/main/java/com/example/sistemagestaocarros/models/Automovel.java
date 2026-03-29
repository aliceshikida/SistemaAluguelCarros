package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;

@Entity
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String placa;

    // NOVO: Aponta para a Empresa dona do automóvel
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    public Automovel() {}

    // Getters e Setters antigos...
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }

    // Novos Getters e Setters
    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }
}