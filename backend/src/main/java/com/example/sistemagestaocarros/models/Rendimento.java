package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;

@Entity
public class Rendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double valor;
    private String descricao;

    // NOVO: Volta para o Cliente
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // NOVO: Liga com o Empregador
    @ManyToOne
    @JoinColumn(name = "empregador_id")
    private Empregador empregador;

    public Rendimento() {}

    // Getters e Setters antigos...
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    // Novos Getters e Setters
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Empregador getEmpregador() { return empregador; }
    public void setEmpregador(Empregador empregador) { this.empregador = empregador; }
}