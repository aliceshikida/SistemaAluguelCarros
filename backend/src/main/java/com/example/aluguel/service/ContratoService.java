package com.example.aluguel.service;

import com.example.aluguel.dto.ContratoCreateRequest;
import com.example.aluguel.dto.ContratoCreditoRequest;
import com.example.aluguel.dto.ContratoCreditoResponse;
import com.example.aluguel.dto.ContratoResponse;
import com.example.aluguel.model.Banco;
import com.example.aluguel.model.Contrato;
import com.example.aluguel.model.ContratoCredito;
import com.example.aluguel.model.Empresa;
import com.example.aluguel.model.PedidoAluguel;
import com.example.aluguel.model.StatusPedido;
import com.example.aluguel.repository.BancoRepository;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.ContratoCreditoRepository;
import com.example.aluguel.repository.ContratoRepository;
import com.example.aluguel.repository.EmpresaRepository;
import com.example.aluguel.repository.PedidoAluguelRepository;
import com.example.aluguel.security.Roles;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import io.micronaut.security.authentication.Authentication;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final ContratoCreditoRepository contratoCreditoRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;
    private final ClienteRepository clienteRepository;

    public ContratoService(
        ContratoRepository contratoRepository,
        ContratoCreditoRepository contratoCreditoRepository,
        PedidoAluguelRepository pedidoRepository,
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository,
        ClienteRepository clienteRepository
    ) {
        this.contratoRepository = contratoRepository;
        this.contratoCreditoRepository = contratoCreditoRepository;
        this.pedidoRepository = pedidoRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public ContratoResponse criar(ContratoCreateRequest request, Authentication authentication) {
        exigirPapel(authentication, Roles.EMPRESA);
        Empresa empresa = empresaRepository.findByUsuario_Login(authentication.getName())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Empresa não encontrada"));
        PedidoAluguel pedido = pedidoRepository.findById(request.getPedidoId())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (pedido.getStatus() != StatusPedido.APROVADO) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Pedido deve estar APROVADO para gerar contrato");
        }
        if (contratoRepository.existsByPedido_Id(pedido.getId())) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Já existe contrato para este pedido");
        }
        validarPeriodoContrato(request.getDataInicio(), request.getDataFim());
        Contrato c = new Contrato();
        c.setPedido(pedido);
        c.setEmpresa(empresa);
        c.setValorTotal(request.getValorTotal());
        c.setDataInicio(request.getDataInicio());
        c.setDataFim(request.getDataFim());
        c.setObservacao(trimOrNull(request.getObservacao()));
        Contrato salvo = contratoRepository.save(c);
        pedido.setStatus(StatusPedido.CONCLUIDO);
        pedidoRepository.save(pedido);
        return paraResponse(salvo);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ContratoResponse> listar(Authentication authentication) {
        if (temPapel(authentication, Roles.CLIENTE)) {
            var cliente = clienteRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
            return contratoRepository.findAllByPedidoClienteId(cliente.getId()).stream()
                .map(this::paraResponse)
                .collect(Collectors.toList());
        }
        if (temPapel(authentication, Roles.EMPRESA)) {
            Empresa empresa = empresaRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Empresa não encontrada"));
            return contratoRepository.findByEmpresa_Id(empresa.getId()).stream()
                .map(this::paraResponse)
                .collect(Collectors.toList());
        }
        if (temPapel(authentication, Roles.BANCO)) {
            return contratoRepository.findAll().stream().map(this::paraResponse).collect(Collectors.toList());
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public ContratoResponse buscar(Long id, Authentication authentication) {
        Contrato c = contratoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado"));
        garantirLeituraContrato(c, authentication);
        return paraResponse(c);
    }

    @Transactional
    public ContratoResponse adicionarCredito(Long contratoId, ContratoCreditoRequest request, Authentication authentication) {
        exigirPapel(authentication, Roles.BANCO);
        Banco banco = bancoRepository.findByUsuario_Login(authentication.getName())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Banco não encontrado"));
        Contrato c = contratoRepository.findById(contratoId)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado"));
        if (contratoCreditoRepository.existsByContrato_Id(contratoId)) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Contrato já possui financiamento registrado");
        }
        ContratoCredito cc = new ContratoCredito();
        cc.setContrato(c);
        cc.setBanco(banco);
        cc.setValor(request.getValor());
        cc.setQuantidadeParcelas(request.getQuantidadeParcelas());
        cc.setObservacao(trimOrNull(request.getObservacao()));
        contratoCreditoRepository.save(cc);
        return paraResponse(contratoRepository.findById(contratoId).orElseThrow());
    }

    private void garantirLeituraContrato(Contrato c, Authentication authentication) {
        if (temPapel(authentication, Roles.BANCO)) {
            return;
        }
        if (temPapel(authentication, Roles.EMPRESA)) {
            Empresa empresa = empresaRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Empresa não encontrada"));
            if (!c.getEmpresa().getId().equals(empresa.getId())) {
                throw new HttpStatusException(HttpStatus.FORBIDDEN, "Contrato de outra empresa");
            }
            return;
        }
        if (temPapel(authentication, Roles.CLIENTE)) {
            var cliente = clienteRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado"));
            if (!c.getPedido().getCliente().getId().equals(cliente.getId())) {
                throw new HttpStatusException(HttpStatus.FORBIDDEN, "Contrato não pertence ao cliente");
            }
            return;
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    private ContratoResponse paraResponse(Contrato c) {
        ContratoResponse r = new ContratoResponse();
        r.setId(c.getId());
        r.setPedidoId(c.getPedido().getId());
        r.setEmpresaId(c.getEmpresa().getId());
        r.setEmpresaNome(c.getEmpresa().getNome());
        r.setValorTotal(c.getValorTotal());
        r.setDataInicio(c.getDataInicio());
        r.setDataFim(c.getDataFim());
        r.setObservacao(c.getObservacao());
        contratoCreditoRepository.findByContrato_Id(c.getId()).ifPresent(cc -> {
            ContratoCreditoResponse cr = new ContratoCreditoResponse();
            cr.setId(cc.getId());
            cr.setBancoId(cc.getBanco().getId());
            cr.setBancoNome(cc.getBanco().getNome());
            cr.setValor(cc.getValor());
            cr.setQuantidadeParcelas(cc.getQuantidadeParcelas());
            cr.setObservacao(cc.getObservacao());
            r.setCredito(cr);
        });
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

    private static void exigirPapel(Authentication authentication, String role) {
        if (!temPapel(authentication, role)) {
            throw new HttpStatusException(HttpStatus.FORBIDDEN, "Papel necessário: " + role);
        }
    }

    private static void validarPeriodoContrato(LocalDate inicio, LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Data fim deve ser >= data início");
        }
    }
}
