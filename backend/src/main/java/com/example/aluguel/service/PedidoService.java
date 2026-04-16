package com.example.aluguel.service;

import com.example.aluguel.dto.DecisaoPedidoRequest;
import com.example.aluguel.dto.PedidoCreateRequest;
import com.example.aluguel.dto.PedidoResponse;
import com.example.aluguel.dto.PedidoUpdateRequest;
import com.example.aluguel.model.Automovel;
import com.example.aluguel.model.Cliente;
import com.example.aluguel.model.PedidoAluguel;
import com.example.aluguel.model.StatusPedido;
import com.example.aluguel.repository.AutomovelRepository;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.PedidoAluguelRepository;
import com.example.aluguel.security.Roles;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import io.micronaut.security.authentication.Authentication;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class PedidoService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoService(
        PedidoAluguelRepository pedidoRepository,
        ClienteRepository clienteRepository,
        AutomovelRepository automovelRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    @Transactional
    public PedidoResponse criar(PedidoCreateRequest request, Authentication authentication) {
        exigirPapel(authentication, Roles.CLIENTE);
        Cliente cliente = clienteRepository.findByUsuario_Login(authentication.getName())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
        validarPeriodo(request.getDataInicio(), request.getDataFim());
        Automovel auto = automovelRepository.findById(request.getAutomovelId())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.BAD_REQUEST, "Automóvel não encontrado"));
        PedidoAluguel p = new PedidoAluguel();
        p.setCliente(cliente);
        p.setAutomovel(auto);
        p.setDataInicio(request.getDataInicio());
        p.setDataFim(request.getDataFim());
        p.setValorEstimado(request.getValorEstimado());
        p.setObservacaoCliente(trimOrNull(request.getObservacaoCliente()));
        p.setStatus(StatusPedido.SOLICITADO);
        PedidoAluguel salvo = pedidoRepository.save(p);
        return paraResponse(salvo);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<PedidoResponse> listar(Authentication authentication) {
        if (temPapel(authentication, Roles.CLIENTE)) {
            Cliente cliente = clienteRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
            return pedidoRepository.findByCliente_Id(cliente.getId()).stream()
                .map(this::paraResponse)
                .collect(Collectors.toList());
        }
        if (temAgente(authentication)) {
            return pedidoRepository.findAll().stream().map(this::paraResponse).collect(Collectors.toList());
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public PedidoResponse buscar(Long id, Authentication authentication) {
        PedidoAluguel p = pedidoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        garantirLeituraPedido(p, authentication);
        return paraResponse(p);
    }

    @Transactional
    public PedidoResponse atualizar(Long id, PedidoUpdateRequest request, Authentication authentication) {
        exigirPapel(authentication, Roles.CLIENTE);
        PedidoAluguel p = pedidoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        Cliente cliente = clienteRepository.findByUsuario_Login(authentication.getName())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
        if (!p.getCliente().getId().equals(cliente.getId())) {
            throw new HttpStatusException(HttpStatus.FORBIDDEN, "Pedido de outro cliente");
        }
        if (p.getStatus() != StatusPedido.SOLICITADO) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Só é permitido alterar pedido em status SOLICITADO");
        }
        validarPeriodo(request.getDataInicio(), request.getDataFim());
        Automovel auto = automovelRepository.findById(request.getAutomovelId())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.BAD_REQUEST, "Automóvel não encontrado"));
        p.setAutomovel(auto);
        p.setDataInicio(request.getDataInicio());
        p.setDataFim(request.getDataFim());
        p.setValorEstimado(request.getValorEstimado());
        p.setObservacaoCliente(trimOrNull(request.getObservacaoCliente()));
        return paraResponse(pedidoRepository.save(p));
    }

    @Transactional
    public PedidoResponse cancelar(Long id, Authentication authentication) {
        exigirPapel(authentication, Roles.CLIENTE);
        PedidoAluguel p = pedidoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        Cliente cliente = clienteRepository.findByUsuario_Login(authentication.getName())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
        if (!p.getCliente().getId().equals(cliente.getId())) {
            throw new HttpStatusException(HttpStatus.FORBIDDEN, "Pedido de outro cliente");
        }
        if (p.getStatus() != StatusPedido.SOLICITADO && p.getStatus() != StatusPedido.EM_ANALISE_FINANCEIRA) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Cancelamento não permitido para o status atual");
        }
        p.setStatus(StatusPedido.CANCELADO);
        return paraResponse(pedidoRepository.save(p));
    }

    @Transactional
    public PedidoResponse iniciarAnaliseFinanceira(Long id, Authentication authentication) {
        exigirAgente(authentication);
        PedidoAluguel p = pedidoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (p.getStatus() != StatusPedido.SOLICITADO) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Pedido deve estar SOLICITADO para iniciar análise");
        }
        p.setStatus(StatusPedido.EM_ANALISE_FINANCEIRA);
        return paraResponse(pedidoRepository.save(p));
    }

    @Transactional
    public PedidoResponse decidir(Long id, DecisaoPedidoRequest request, Authentication authentication) {
        exigirAgente(authentication);
        PedidoAluguel p = pedidoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (p.getStatus() != StatusPedido.SOLICITADO && p.getStatus() != StatusPedido.EM_ANALISE_FINANCEIRA) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Decisão só é permitida nos status SOLICITADO ou EM_ANALISE_FINANCEIRA");
        }
        p.setParecerFinanceiro(request.getParecerFinanceiro().trim());
        if (Boolean.TRUE.equals(request.getAprovado())) {
            p.setStatus(StatusPedido.APROVADO);
        } else {
            p.setStatus(StatusPedido.REPROVADO);
        }
        return paraResponse(pedidoRepository.save(p));
    }

    private void garantirLeituraPedido(PedidoAluguel p, Authentication authentication) {
        if (temAgente(authentication)) {
            return;
        }
        if (temPapel(authentication, Roles.CLIENTE)) {
            Cliente cliente = clienteRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
            if (!p.getCliente().getId().equals(cliente.getId())) {
                throw new HttpStatusException(HttpStatus.FORBIDDEN, "Pedido de outro cliente");
            }
            return;
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    private static void validarPeriodo(java.time.LocalDate inicio, java.time.LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Data fim deve ser >= data início");
        }
    }

    private PedidoResponse paraResponse(PedidoAluguel p) {
        PedidoResponse r = new PedidoResponse();
        r.setId(p.getId());
        r.setClienteId(p.getCliente().getId());
        r.setClienteNome(p.getCliente().getNome());
        r.setAutomovelId(p.getAutomovel().getId());
        r.setAutomovelPlaca(p.getAutomovel().getPlaca());
        r.setAutomovelMarca(p.getAutomovel().getMarca());
        r.setAutomovelModelo(p.getAutomovel().getModelo());
        r.setDataInicio(p.getDataInicio());
        r.setDataFim(p.getDataFim());
        r.setValorEstimado(p.getValorEstimado());
        r.setStatus(p.getStatus());
        r.setObservacaoCliente(p.getObservacaoCliente());
        r.setParecerFinanceiro(p.getParecerFinanceiro());
        return r;
    }

    private static String trimOrNull(String s) {
        if (s == null) {
            return null;
        }
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private static boolean temPapel(Authentication authentication, String role) {
        return authentication != null && authentication.getRoles().contains(role);
    }

    private static boolean temAgente(Authentication authentication) {
        return temPapel(authentication, Roles.EMPRESA) || temPapel(authentication, Roles.BANCO);
    }

    private static void exigirPapel(Authentication authentication, String role) {
        if (!temPapel(authentication, role)) {
            throw new HttpStatusException(HttpStatus.FORBIDDEN, "Papel necessário: " + role);
        }
    }

    private static void exigirAgente(Authentication authentication) {
        if (!temAgente(authentication)) {
            throw new HttpStatusException(HttpStatus.FORBIDDEN, "Apenas agentes (empresa ou banco)");
        }
    }
}
