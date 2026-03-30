package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.AgenteTipos;
import com.example.sistemagestaocarros.PedidoStatuses;
import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.ContratoCreateRequest;
import com.example.sistemagestaocarros.models.Agente;
import com.example.sistemagestaocarros.models.Contrato;
import com.example.sistemagestaocarros.models.PedidoAluguel;
import com.example.sistemagestaocarros.models.Usuario;
import com.example.sistemagestaocarros.repositories.AutomovelRepository;
import com.example.sistemagestaocarros.repositories.ContratoRepository;
import com.example.sistemagestaocarros.repositories.PedidoAluguelRepository;
import com.example.sistemagestaocarros.repositories.UsuarioRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller("/api/contratos")
public class ContratoController {

    private final ContratoRepository contratoRepository;
    private final PedidoAluguelRepository pedidoRepository;
    private final AutomovelRepository automovelRepository;
    private final UsuarioRepository usuarioRepository;

    public ContratoController(
        ContratoRepository contratoRepository,
        PedidoAluguelRepository pedidoRepository,
        AutomovelRepository automovelRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.contratoRepository = contratoRepository;
        this.pedidoRepository = pedidoRepository;
        this.automovelRepository = automovelRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Get("/")
    @Transactional
    public List<Contrato> listar(HttpRequest<?> request) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        List<Contrato> all = new ArrayList<>();
        contratoRepository.findAll().forEach(all::add);
        if (Roles.CLIENTE.equals(role)) {
            return all.stream()
                .filter(c -> c.getPedidoAluguel() != null && Objects.equals(c.getPedidoAluguel().getCliente().getId(), uid))
                .collect(Collectors.toList());
        }
        if (Roles.AGENTE.equals(role)) {
            return all;
        }
        throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Sem permissão");
    }

    @Get("/{id}")
    @Transactional
    public HttpResponse<Contrato> obter(@PathVariable Integer id, HttpRequest<?> request) {
        Contrato c = contratoRepository.findById(id).orElse(null);
        if (c == null) {
            return HttpResponse.status(HttpStatus.NOT_FOUND);
        }
        if (!canView(request, c)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        return HttpResponse.ok(c);
    }

    @Post("/")
    @Transactional
    public HttpResponse<Contrato> criar(@Body ContratoCreateRequest body, HttpRequest<?> request) {
        requireAgenteEmpresa(request);
        PedidoAluguel pedido = pedidoRepository.findById(body.pedidoId()).orElseThrow();
        if (!PedidoStatuses.APROVADO.equals(pedido.getStatus())) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        if (contratoRepository.findByPedidoAluguel(pedido).isPresent()) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        Contrato c = new Contrato();
        c.setTipo(body.tipo());
        c.setPedidoAluguel(pedido);
        c.setAutomovel(automovelRepository.findById(body.automovelId()).orElseThrow());
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            c.setDataInicio(sdf.parse(body.dataInicio()));
            c.setDataFim(sdf.parse(body.dataFim()));
        } catch (ParseException e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        contratoRepository.save(c);
        return HttpResponse.created(c);
    }

    private boolean canView(HttpRequest<?> request, Contrato c) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElse(null);
        if (uid == null) {
            return false;
        }
        if (Roles.AGENTE.equals(role)) {
            return true;
        }
        if (Roles.CLIENTE.equals(role) && c.getPedidoAluguel() != null) {
            return Objects.equals(c.getPedidoAluguel().getCliente().getId(), uid);
        }
        return false;
    }

    private void requireAgenteEmpresa(HttpRequest<?> request) {
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        String role = request.getAttribute("userRole", String.class).orElse("");
        if (!Roles.AGENTE.equals(role)) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas agentes");
        }
        Usuario u = usuarioRepository.findById(uid).orElseThrow();
        if (!(u instanceof Agente a) || !AgenteTipos.EMPRESA.equals(a.getTipo())) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas agente empresa");
        }
    }
}
