package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.PedidoStatuses;
import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.PedidoCreateRequest;
import com.example.sistemagestaocarros.dto.PedidoDecisaoRequest;
import com.example.sistemagestaocarros.dto.PedidoUpdateRequest;
import com.example.sistemagestaocarros.models.Agente;
import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.models.PedidoAluguel;
import com.example.sistemagestaocarros.models.Usuario;
import com.example.sistemagestaocarros.repositories.AutomovelRepository;
import com.example.sistemagestaocarros.repositories.ClienteRepository;
import com.example.sistemagestaocarros.repositories.PedidoAluguelRepository;
import com.example.sistemagestaocarros.repositories.UsuarioRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Controller("/api/pedidos")
public class PedidoController {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoController(
        PedidoAluguelRepository pedidoRepository,
        ClienteRepository clienteRepository,
        UsuarioRepository usuarioRepository,
        AutomovelRepository automovelRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.automovelRepository = automovelRepository;
    }

    @Get("/")
    @Transactional
    public List<PedidoAluguel> listar(HttpRequest<?> request) {
        String role = request.getAttribute("userRole", String.class).orElse(null);
        Integer uid = request.getAttribute("userId", Integer.class).orElse(null);
        if (uid == null || role == null) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        if (Roles.CLIENTE.equals(role)) {
            Cliente c = clienteRepository.findById(uid).orElseThrow();
            return pedidoRepository.findByCliente(c);
        }
        if (Roles.AGENTE.equals(role)) {
            return (List<PedidoAluguel>) pedidoRepository.findAll();
        }
        throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Sem permissão");
    }

    @Get("/{id}")
    @Transactional
    public HttpResponse<PedidoAluguel> obter(@PathVariable Integer id, HttpRequest<?> request) {
        PedidoAluguel p = pedidoRepository.findById(id).orElseThrow();
        if (!canAccessPedido(request, p)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        return HttpResponse.ok(p);
    }

    @Post("/")
    @Transactional
    public HttpResponse<PedidoAluguel> criar(@Body PedidoCreateRequest body, HttpRequest<?> request) {
        requireCliente(request);
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        Cliente c = clienteRepository.findById(uid).orElseThrow();
        PedidoAluguel p = new PedidoAluguel();
        p.setDataSolicitacao(new Date());
        p.setStatus(PedidoStatuses.PENDENTE);
        p.setCliente(c);
        p.setObservacao(body.observacao());
        if (body.automovelId() != null) {
            p.setAutomovel(automovelRepository.findById(body.automovelId()).orElseThrow());
        }
        pedidoRepository.save(p);
        return HttpResponse.created(p);
    }

    @Put("/{id}")
    @Transactional
    public HttpResponse<PedidoAluguel> atualizar(
        @PathVariable Integer id,
        @Body PedidoUpdateRequest body,
        HttpRequest<?> request
    ) {
        PedidoAluguel p = pedidoRepository.findById(id).orElseThrow();
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();

        if (Roles.CLIENTE.equals(role)) {
            if (!Objects.equals(p.getCliente().getId(), uid)) {
                return HttpResponse.status(HttpStatus.FORBIDDEN);
            }
            if (!PedidoStatuses.PENDENTE.equals(p.getStatus())) {
                return HttpResponse.status(HttpStatus.BAD_REQUEST);
            }
            if (body.automovelId() != null) {
                p.setAutomovel(automovelRepository.findById(body.automovelId()).orElseThrow());
            }
            if (body.observacao() != null) {
                p.setObservacao(body.observacao());
            }
        } else if (Roles.AGENTE.equals(role)) {
            if (body.analiseFinanceira() != null) {
                p.setAnaliseFinanceira(body.analiseFinanceira());
            }
            if (body.observacao() != null) {
                p.setObservacao(body.observacao());
            }
            if (body.automovelId() != null) {
                p.setAutomovel(automovelRepository.findById(body.automovelId()).orElseThrow());
            }
        } else {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        pedidoRepository.save(p);
        return HttpResponse.ok(p);
    }

    @Post("/{id}/decisao")
    @Transactional
    public HttpResponse<PedidoAluguel> decisao(
        @PathVariable Integer id,
        @Body PedidoDecisaoRequest body,
        HttpRequest<?> request
    ) {
        requireAgente(request);
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        Usuario u = usuarioRepository.findById(uid).orElseThrow();
        if (!(u instanceof Agente agente)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        PedidoAluguel p = pedidoRepository.findById(id).orElseThrow();
        if (!PedidoStatuses.PENDENTE.equals(p.getStatus())) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        String novo = body.status();
        if (!PedidoStatuses.APROVADO.equals(novo) && !PedidoStatuses.REJEITADO.equals(novo)) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        p.setStatus(novo);
        if (body.analiseFinanceira() != null) {
            p.setAnaliseFinanceira(body.analiseFinanceira());
        }
        List<Agente> agentes = p.getAgentes();
        if (agentes == null) {
            agentes = new ArrayList<>();
        }
        boolean exists = agentes.stream().anyMatch(a -> Objects.equals(a.getId(), agente.getId()));
        if (!exists) {
            agentes.add(agente);
            p.setAgentes(agentes);
        }
        pedidoRepository.save(p);
        return HttpResponse.ok(p);
    }

    @Delete("/{id}")
    @Transactional
    public HttpResponse<?> cancelar(@PathVariable Integer id, HttpRequest<?> request) {
        requireCliente(request);
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        PedidoAluguel p = pedidoRepository.findById(id).orElseThrow();
        if (!Objects.equals(p.getCliente().getId(), uid)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        if (!PedidoStatuses.PENDENTE.equals(p.getStatus())) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        p.setStatus(PedidoStatuses.CANCELADO);
        pedidoRepository.save(p);
        return HttpResponse.noContent();
    }

    private void requireCliente(HttpRequest<?> request) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        if (!Roles.CLIENTE.equals(role)) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas clientes");
        }
    }

    private void requireAgente(HttpRequest<?> request) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        if (!Roles.AGENTE.equals(role)) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas agentes");
        }
    }

    private boolean canAccessPedido(HttpRequest<?> request, PedidoAluguel p) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElse(null);
        if (uid == null) {
            return false;
        }
        if (Roles.CLIENTE.equals(role)) {
            return Objects.equals(p.getCliente().getId(), uid);
        }
        return Roles.AGENTE.equals(role);
    }
}
