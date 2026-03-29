package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Banco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String cnpj;

    // NOVO: 1 para N com ContratoCredito
    @OneToMany(mappedBy = "banco")
    private List<ContratoCredito> contratosCredito;

    public Banco() {}

    // Getters e Setters antigos...
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    // Novo Getter e Setter
    public List<ContratoCredito> getContratosCredito() { return contratosCredito; }
    public void setContratosCredito(List<ContratoCredito> contratosCredito) { this.contratosCredito = contratosCredito; }
}