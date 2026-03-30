package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.repositories.ClienteRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;
import java.util.List;

@Controller("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Get("/me")
    @Transactional
    public HttpResponse<Cliente> perfil(HttpRequest<?> request) {
        if (!Roles.CLIENTE.equals(request.getAttribute("userRole", String.class).orElse(""))) {
            return HttpResponse.status(HttpStatus.FORBIDDEN);
        }
        Integer uid = request.getAttribute("userId", Integer.class).orElseThrow();
        Cliente c = clienteRepository.findById(uid).orElseThrow();
        if (c.getRendimentos() != null) {
            c.getRendimentos().size();
        }
        return HttpResponse.ok(c);
    }

    @Get("/")
    @Transactional
    public List<Cliente> listar(HttpRequest<?> request) {
        if (!Roles.AGENTE.equals(request.getAttribute("userRole", String.class).orElse(""))) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas agentes");
        }
        return (List<Cliente>) clienteRepository.findAll();
    }
}
