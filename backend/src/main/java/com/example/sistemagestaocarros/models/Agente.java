package com.example.sistemagestaocarros.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Agente extends Usuario {

    /** EMPRESA ou BANCO */
    private String tipo;

    private Integer idAgente;
    private String nomeFantasia;

    // NOVO: Conexão com os pedidos que este agente analisa
    @ManyToMany(mappedBy = "agentes")
    private List<PedidoAluguel> pedidosAnalisados;

    /** Preenchido quando tipo = BANCO */
    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Banco banco;

    public Agente() {}

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    // Getters e Setters antigos...
    public Integer getIdAgente() { return idAgente; }
    public void setIdAgente(Integer idAgente) { this.idAgente = idAgente; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }

    // Novo Getter e Setter
    @JsonIgnore
    public List<PedidoAluguel> getPedidosAnalisados() { return pedidosAnalisados; }
    public void setPedidosAnalisados(List<PedidoAluguel> pedidosAnalisados) { this.pedidosAnalisados = pedidosAnalisados; }

    public Banco getBanco() { return banco; }
    public void setBanco(Banco banco) { this.banco = banco; }
}