package com.example.sistemagestaocarros.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Cliente extends Usuario {

    private String rg;
    private String cpf;
    private String profissao;

    // NOVO: Relacionamento 1 para N com Rendimento
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Rendimento> rendimentos;

    // NOVO: Relacionamento 1 para N com PedidoAluguel
    @OneToMany(mappedBy = "cliente")
    private List<PedidoAluguel> pedidos;

    public Cliente() {}

    // Getters e Setters
    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }
    
    // Novos Getters e Setters das listas
    public List<Rendimento> getRendimentos() { return rendimentos; }
    public void setRendimentos(List<Rendimento> rendimentos) { this.rendimentos = rendimentos; }
    @JsonIgnore
    public List<PedidoAluguel> getPedidos() { return pedidos; }
    public void setPedidos(List<PedidoAluguel> pedidos) { this.pedidos = pedidos; }
}