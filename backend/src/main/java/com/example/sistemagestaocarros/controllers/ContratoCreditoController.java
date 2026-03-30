package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.AgenteTipos;
import com.example.sistemagestaocarros.CreditoStatuses;
import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.ContratoCreditoCreateRequest;
import com.example.sistemagestaocarros.models.Agente;
import com.example.sistemagestaocarros.models.Contrato;
import com.example.sistemagestaocarros.models.ContratoCredito;
import com.example.sistemagestaocarros.models.Usuario;
import com.example.sistemagestaocarros.repositories.ContratoCreditoRepository;
import com.example.sistemagestaocarros.repositories.ContratoRepository;
import com.example.sistemagestaocarros.repositories.UsuarioRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller("/api/creditos")
public class ContratoCreditoController {

    private final ContratoCreditoRepository creditoRepository;
    private final ContratoRepository contratoRepository;
    private final UsuarioRepository usuarioRepository;

    public ContratoCreditoController(
        ContratoCreditoRepository creditoRepository,
        ContratoRepository contratoRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.creditoRepository = creditoRepository;
        this.contratoRepository = contratoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Get("/")
    @Transactional
    public List<ContratoCredito> listar(HttpRequest<?> request) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        List<ContratoCredito> all = new ArrayList<>();
        creditoRepository.findAll().forEach(all::add);
        if (Roles.CLIENTE.equals(role)) {
            return all.stream()
                .filter(cc -> {
                    Contrato ct = cc.getContrato();
                    return ct != null && ct.getPedidoAluguel() != null
                        && Objects.equals(ct.getPedidoAluguel().getCliente().getId(), uid);
                })
                .collect(Collectors.toList());
        }
        if (Roles.AGENTE.equals(role)) {
            return all;
        }
        throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Sem permissão");
    }

    @Get("/{id}")
    @Transactional
    public HttpResponse<ContratoCredito> obter(@PathVariable Integer id, HttpRequest<?> request) {
        ContratoCredito cc = creditoRepository.findById(id).orElse(null);
        if (cc == null) {
            return HttpResponse.status(HttpStatus.NOT_FOUND);
        }
        if (!canView(request, cc)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        return HttpResponse.ok(cc);
    }

    @Post("/")
    @Transactional
    public HttpResponse<ContratoCredito> criar(@Body ContratoCreditoCreateRequest body, HttpRequest<?> request) {
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        String role = request.getAttribute("userRole", String.class).orElse("");
        if (!Roles.AGENTE.equals(role)) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        Usuario u = usuarioRepository.findById(uid).orElseThrow();
        if (!(u instanceof Agente agente) || !AgenteTipos.BANCO.equals(agente.getTipo())) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        if (agente.getBanco() == null) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        Contrato contrato = contratoRepository.findById(body.contratoId()).orElseThrow();
        if (creditoRepository.findByContrato(contrato).isPresent()) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST);
        }
        ContratoCredito cc = new ContratoCredito();
        cc.setValor(body.valor());
        cc.setTaxajuros(body.taxaJuros());
        cc.setPrazo(body.prazo());
        cc.setContrato(contrato);
        cc.setBanco(agente.getBanco());
        cc.setStatus(CreditoStatuses.PENDENTE);
        creditoRepository.save(cc);
        return HttpResponse.created(cc);
    }

    private boolean canView(HttpRequest<?> request, ContratoCredito cc) {
        String role = request.getAttribute("userRole", String.class).orElse("");
        Integer uid = request.getAttribute("userId", Integer.class).orElse(null);
        if (uid == null) {
            return false;
        }
        if (Roles.AGENTE.equals(role)) {
            return true;
        }
        if (Roles.CLIENTE.equals(role)) {
            Contrato ct = cc.getContrato();
            return ct != null && ct.getPedidoAluguel() != null
                && Objects.equals(ct.getPedidoAluguel().getCliente().getId(), uid);
        }
        return false;
    }
}
