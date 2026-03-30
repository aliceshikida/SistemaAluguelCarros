package com.example.sistemagestaocarros.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class PedidoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPedido;

    @Temporal(TemporalType.DATE)
    private Date dataSolicitacao;

    private String status;

    private String observacao;

    /** Análise / parecer financeiro do agente */
    private String analiseFinanceira;

    @ManyToOne
    @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    // NOVO: A conexão apontando de volta para o Cliente!
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // NOVO: Relação N:N com os Agentes que analisam o pedido
    @ManyToMany
    @JoinTable(
        name = "pedido_agente",
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "agente_id")
    )
    private List<Agente> agentes;

    public PedidoAluguel() {}

    // Getters e Setters antigos...
    public Integer getIdPedido() { return idPedido; }
    public void setIdPedido(Integer idPedido) { this.idPedido = idPedido; }

    public Date getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(Date dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public String getAnaliseFinanceira() { return analiseFinanceira; }
    public void setAnaliseFinanceira(String analiseFinanceira) { this.analiseFinanceira = analiseFinanceira; }

    public Automovel getAutomovel() { return automovel; }
    public void setAutomovel(Automovel automovel) { this.automovel = automovel; }

    // Novos Getters e Setters
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public List<Agente> getAgentes() { return agentes; }
    public void setAgentes(List<Agente> agentes) { this.agentes = agentes; }

    // NOVO atributo
    @OneToOne(mappedBy = "pedidoAluguel")
    private Contrato contrato;

    // NOVOS getters e setters
    @JsonIgnore
    public Contrato getContrato() { return contrato; }
    public void setContrato(Contrato contrato) { this.contrato = contrato; }

    public Integer getContratoId() {
        return contrato != null ? contrato.getIdContrato() : null;
    }
}