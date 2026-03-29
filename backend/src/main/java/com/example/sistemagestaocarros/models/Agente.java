package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Agente extends Usuario {

    private Integer idAgente;
    private String nomeFantasia;

    // NOVO: Conexão com os pedidos que este agente analisa
    @ManyToMany(mappedBy = "agentes")
    private List<PedidoAluguel> pedidosAnalisados;

    public Agente() {}

    // Getters e Setters antigos...
    public Integer getIdAgente() { return idAgente; }
    public void setIdAgente(Integer idAgente) { this.idAgente = idAgente; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    // Novo Getter e Setter
    public List<PedidoAluguel> getPedidosAnalisados() { return pedidosAnalisados; }
    public void setPedidosAnalisados(List<PedidoAluguel> pedidosAnalisados) { this.pedidosAnalisados = pedidosAnalisados; }
}