package com.example.sistemagestaocarros;

import com.example.sistemagestaocarros.models.*;
import com.example.sistemagestaocarros.repositories.*;
import io.micronaut.context.annotation.Context;
import com.example.sistemagestaocarros.security.PasswordHasher;
import jakarta.annotation.PostConstruct;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Singleton
@Context
public class DataSeed {

    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;
    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final AutomovelRepository automovelRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final ContratoRepository contratoRepository;
    private final ContratoCreditoRepository creditoRepository;
    private final EmpregadorRepository empregadorRepository;
    private final RendimentoRepository rendimentoRepository;
    private final PasswordHasher passwordHasher;

    public DataSeed(
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository,
        ClienteRepository clienteRepository,
        AgenteRepository agenteRepository,
        AutomovelRepository automovelRepository,
        PedidoAluguelRepository pedidoRepository,
        ContratoRepository contratoRepository,
        ContratoCreditoRepository creditoRepository,
        EmpregadorRepository empregadorRepository,
        RendimentoRepository rendimentoRepository,
        PasswordHasher passwordHasher
    ) {
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.automovelRepository = automovelRepository;
        this.pedidoRepository = pedidoRepository;
        this.contratoRepository = contratoRepository;
        this.creditoRepository = creditoRepository;
        this.empregadorRepository = empregadorRepository;
        this.rendimentoRepository = rendimentoRepository;
        this.passwordHasher = passwordHasher;
    }

    @PostConstruct
    @Transactional
    public void seed() {
        Empresa emp = empresaRepository.findAll().iterator().hasNext()
            ? empresaRepository.findAll().iterator().next()
            : null;
        if (emp == null) {
            emp = new Empresa();
            emp.setCnpj("11111111000111");
            empresaRepository.save(emp);
        }

        Banco ban = bancoRepository.findAll().iterator().hasNext()
            ? bancoRepository.findAll().iterator().next()
            : null;
        if (ban == null) {
            ban = new Banco();
            ban.setCnpj("22222222000111");
            bancoRepository.save(ban);
        }

        Agente agEmp = agenteRepository.findByLogin("locadora").orElseGet(Agente::new);
        agEmp.setTipo(AgenteTipos.EMPRESA);
        agEmp.setNome("Locadora Exemplo S.A.");
        agEmp.setNomeFantasia("Locadora Exemplo");
        agEmp.setEndereco("Av. Central, 100");
        agEmp.setLogin("locadora");
        agEmp.setSenha(passwordHasher.hash("locadora"));
        agEmp.setIdAgente(1);
        agEmp.setEmpresa(emp);
        agenteRepository.save(agEmp);

        Agente agBan = agenteRepository.findByLogin("bancoexemplo").orElseGet(Agente::new);
        agBan.setTipo(AgenteTipos.BANCO);
        agBan.setNome("Banco Exemplo");
        agBan.setNomeFantasia("Banco Exemplo");
        agBan.setEndereco("Rua do Ouro, 50");
        agBan.setLogin("bancoexemplo");
        agBan.setSenha(passwordHasher.hash("bancoexemplo"));
        agBan.setBanco(ban);
        agBan.setIdAgente(2);
        agenteRepository.save(agBan);

        Cliente c1 = clienteRepository.findByLogin("cliente1").orElseGet(Cliente::new);
        c1.setNome("Cliente Um");
        c1.setEndereco("Rua A, 10");
        c1.setLogin("cliente1");
        c1.setSenha(passwordHasher.hash("cliente1"));
        c1.setRg("MG-12.345.678");
        c1.setCpf("11144477735");
        c1.setProfissao("Engenheiro");
        clienteRepository.save(c1);

        Empregador em1 = new Empregador();
        em1.setNome("Tech Corp");
        empregadorRepository.save(em1);
        Rendimento r1 = new Rendimento();
        r1.setCliente(c1);
        r1.setEmpregador(em1);
        r1.setValor(5000.0);
        r1.setDescricao("Salário");
        rendimentoRepository.save(r1);

        Cliente c2 = clienteRepository.findByLogin("cliente2").orElseGet(Cliente::new);
        c2.setNome("Cliente Dois");
        c2.setEndereco("Rua B, 20");
        c2.setLogin("cliente2");
        c2.setSenha(passwordHasher.hash("cliente2"));
        c2.setRg("SP-98.765.432");
        c2.setCpf("52998224725");
        c2.setProfissao("Advogado");
        clienteRepository.save(c2);

        if (automovelRepository.count() > 0 || pedidoRepository.count() > 0) {
            return;
        }

        Automovel a1 = new Automovel();
        a1.setMatricula("MAT-001");
        a1.setAno(2023);
        a1.setMarca("Toyota");
        a1.setModelo("Corolla");
        a1.setPlaca("ABC1D23");
        a1.setEmpresa(emp);
        automovelRepository.save(a1);

        Automovel a2 = new Automovel();
        a2.setMatricula("MAT-002");
        a2.setAno(2022);
        a2.setMarca("Honda");
        a2.setModelo("Civic");
        a2.setPlaca("XYZ9K87");
        a2.setEmpresa(emp);
        automovelRepository.save(a2);

        Automovel a3 = new Automovel();
        a3.setMatricula("MAT-003");
        a3.setAno(2024);
        a3.setMarca("VW");
        a3.setModelo("T-Cross");
        a3.setPlaca("QWE4R56");
        a3.setEmpresa(emp);
        automovelRepository.save(a3);

        PedidoAluguel p1 = new PedidoAluguel();
        p1.setDataSolicitacao(new Date());
        p1.setStatus(PedidoStatuses.PENDENTE);
        p1.setCliente(c1);
        p1.setAutomovel(a1);
        p1.setObservacao("Pedido de teste pendente");
        pedidoRepository.save(p1);

        PedidoAluguel p2 = new PedidoAluguel();
        p2.setDataSolicitacao(new Date());
        p2.setStatus(PedidoStatuses.APROVADO);
        p2.setCliente(c1);
        p2.setAutomovel(a2);
        p2.setObservacao("Pedido aprovado");
        p2.setAnaliseFinanceira("Renda compatível");
        List<Agente> ags = new ArrayList<>();
        ags.add(agEmp);
        p2.setAgentes(ags);
        pedidoRepository.save(p2);

        PedidoAluguel p3 = new PedidoAluguel();
        p3.setDataSolicitacao(new Date());
        p3.setStatus(PedidoStatuses.REJEITADO);
        p3.setCliente(c2);
        p3.setAutomovel(a3);
        p3.setAnaliseFinanceira("Score insuficiente");
        pedidoRepository.save(p3);

        PedidoAluguel p4 = new PedidoAluguel();
        p4.setDataSolicitacao(new Date());
        p4.setStatus(PedidoStatuses.CANCELADO);
        p4.setCliente(c2);
        p4.setObservacao("Cancelado pelo cliente");
        pedidoRepository.save(p4);

        Contrato ct = new Contrato();
        ct.setTipo("ALUGUEL");
        ct.setDataInicio(new Date());
        ct.setDataFim(new Date(System.currentTimeMillis() + 86400000L * 30));
        ct.setPedidoAluguel(p2);
        ct.setAutomovel(a2);
        contratoRepository.save(ct);

        ContratoCredito cc = new ContratoCredito();
        cc.setValor(25000.0);
        cc.setTaxajuros(1.2);
        cc.setPrazo(48);
        cc.setContrato(ct);
        cc.setBanco(ban);
        cc.setStatus(CreditoStatuses.ATIVO);
        creditoRepository.save(cc);
    }
}
