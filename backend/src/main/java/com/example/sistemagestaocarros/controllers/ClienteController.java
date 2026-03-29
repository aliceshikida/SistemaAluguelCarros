package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.repositories.ClienteRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import java.util.List;

@Controller("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Get("/")
    public List<Cliente> listar() {
        return (List<Cliente>) clienteRepository.findAll();
    }

    @Post("/")
    public HttpResponse<Cliente> salvar(@Body Cliente cliente) {
        return HttpResponse.created(clienteRepository.save(cliente));
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(Integer id) {
        clienteRepository.deleteById(id);
        return HttpResponse.noContent();
    }
}