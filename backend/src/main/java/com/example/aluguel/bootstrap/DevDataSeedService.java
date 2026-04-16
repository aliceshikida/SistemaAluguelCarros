package com.example.aluguel.bootstrap;

import com.example.aluguel.model.Automovel;
import com.example.aluguel.model.Banco;
import com.example.aluguel.model.Cliente;
import com.example.aluguel.model.Empresa;
import com.example.aluguel.model.Papel;
import com.example.aluguel.model.PedidoAluguel;
import com.example.aluguel.model.StatusPedido;
import com.example.aluguel.model.TipoProprietario;
import com.example.aluguel.model.Usuario;
import com.example.aluguel.repository.AutomovelRepository;
import com.example.aluguel.repository.BancoRepository;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.EmpresaRepository;
import com.example.aluguel.repository.PedidoAluguelRepository;
import com.example.aluguel.repository.UsuarioRepository;
import com.example.aluguel.security.PasswordHasher;
import io.micronaut.context.annotation.Requires;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Popula usuários e dados mínimos para testes locais (H2 arquivo). Desligado em testes ({@code app.dev.seed.enabled=false}).
 */
@Singleton
@Requires(property = "app.dev.seed.enabled", value = "true")
public class DevDataSeedService {

    private static final Logger LOG = LoggerFactory.getLogger(DevDataSeedService.class);

    static final String LOGIN_CLIENTE = "clientedemo";
    static final String LOGIN_EMPRESA = "empresademo";
    static final String LOGIN_BANCO = "bancodemo";
    static final String SENHA_DEMO = "senha123";

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;
    private final AutomovelRepository automovelRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final PasswordHasher passwordHasher;

    public DevDataSeedService(
        UsuarioRepository usuarioRepository,
        ClienteRepository clienteRepository,
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository,
        AutomovelRepository automovelRepository,
        PedidoAluguelRepository pedidoRepository,
        PasswordHasher passwordHasher
    ) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
        this.automovelRepository = automovelRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordHasher = passwordHasher;
    }

    @Transactional
    public void seedIfNeeded() {
        if (usuarioRepository.existsByLogin(LOGIN_CLIENTE)) {
            LOG.debug("Dev seed: usuários demo já existem, ignorando.");
            return;
        }

        Usuario uCliente = novoUsuario(LOGIN_CLIENTE, Papel.CLIENTE);
        Cliente cliente = new Cliente();
        cliente.setUsuario(uCliente);
        cliente.setNome("Cliente Demonstração");
        cliente.setCpf("12345678909");
        cliente.setRg("MG-12.345.678");
        cliente.setEndereco("Rua das Flores, 100 — BH");
        cliente.setProfissao("Analista");
        clienteRepository.save(cliente);

        Usuario uEmpresa = novoUsuario(LOGIN_EMPRESA, Papel.EMPRESA);
        Empresa empresa = new Empresa();
        empresa.setUsuario(uEmpresa);
        empresa.setNome("Locadora Demonstração Ltda");
        empresaRepository.save(empresa);

        Usuario uBanco = novoUsuario(LOGIN_BANCO, Papel.BANCO);
        Banco banco = new Banco();
        banco.setUsuario(uBanco);
        banco.setNome("Banco Demonstração SA");
        bancoRepository.save(banco);

        Automovel auto = new Automovel();
        auto.setMatricula("DEMO-2024-001");
        auto.setAno(2023);
        auto.setMarca("Fiat");
        auto.setModelo("Argo");
        auto.setPlaca("ABC1D23");
        auto.setTipoProprietario(TipoProprietario.EMPRESA);
        auto.setProprietarioEmpresa(empresa);
        automovelRepository.save(auto);

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(auto);
        pedido.setDataInicio(LocalDate.now().plusDays(1));
        pedido.setDataFim(LocalDate.now().plusDays(8));
        pedido.setValorEstimado(new BigDecimal("1500.00"));
        pedido.setStatus(StatusPedido.SOLICITADO);
        pedido.setObservacaoCliente("Pedido criado automaticamente para testes (dev seed).");
        pedidoRepository.save(pedido);

        LOG.info(
            "Dev seed aplicado: logins '{}' / '{}' / '{}' — senha '{}'.",
            LOGIN_CLIENTE,
            LOGIN_EMPRESA,
            LOGIN_BANCO,
            SENHA_DEMO
        );
    }

    private Usuario novoUsuario(String login, Papel papel) {
        Usuario u = new Usuario();
        u.setLogin(login);
        u.setSenhaHash(passwordHasher.hash(SENHA_DEMO));
        u.setPapel(papel);
        return usuarioRepository.save(u);
    }
}
