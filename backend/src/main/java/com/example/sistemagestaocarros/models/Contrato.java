package com.example.sistemagestaocarros.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idContrato;

    private String tipo;

    @Temporal(TemporalType.DATE)
    private Date dataInicio;

    @Temporal(TemporalType.DATE)
    private Date dataFim;

    // NOVO: 1 para 1 com PedidoAluguel (o contrato vem do pedido)
    @OneToOne
    @JoinColumn(name = "pedido_id")
    private PedidoAluguel pedidoAluguel;

    // NOVO: N para 1 com Automovel (muitos contratos para o mesmo carro ao longo do tempo)
    @ManyToOne
    @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    // NOVO: 1 para 1 com ContratoCredito
    @OneToOne(mappedBy = "contrato")
    private ContratoCredito contratoCredito;

    public Contrato() {}

    // Getters e Setters antigos...
    public Integer getIdContrato() { return idContrato; }
    public void setIdContrato(Integer idContrato) { this.idContrato = idContrato; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Date getDataInicio() { return dataInicio; }
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }
    public Date getDataFim() { return dataFim; }
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }

    // Novos Getters e Setters
    public PedidoAluguel getPedidoAluguel() { return pedidoAluguel; }
    public void setPedidoAluguel(PedidoAluguel pedidoAluguel) { this.pedidoAluguel = pedidoAluguel; }
    public Automovel getAutomovel() { return automovel; }
    public void setAutomovel(Automovel automovel) { this.automovel = automovel; }
    public ContratoCredito getContratoCredito() { return contratoCredito; }
    public void setContratoCredito(ContratoCredito contratoCredito) { this.contratoCredito = contratoCredito; }
}