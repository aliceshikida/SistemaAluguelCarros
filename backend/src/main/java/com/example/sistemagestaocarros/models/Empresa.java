package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String cnpj;

    // NOVO: Relacionamento 1 para N com Automovel
    @OneToMany(mappedBy = "empresa")
    private List<Automovel> automoveis;

    public Empresa() {}

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    // Novos Getters e Setters
    public List<Automovel> getAutomoveis() { return automoveis; }
    public void setAutomoveis(List<Automovel> automoveis) { this.automoveis = automoveis; }
}