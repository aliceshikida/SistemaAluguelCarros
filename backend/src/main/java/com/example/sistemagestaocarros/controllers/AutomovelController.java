package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.AutomovelUpsertRequest;
import com.example.sistemagestaocarros.models.Automovel;
import com.example.sistemagestaocarros.repositories.AutomovelRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;
import java.util.List;

@Controller("/api/automoveis")
public class AutomovelController {

    private final AutomovelRepository automovelRepository;

    public AutomovelController(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    @Get
    @Transactional
    public List<Automovel> listar(HttpRequest<?> request) {
        requireAuth(request);
        return (List<Automovel>) automovelRepository.findAll();
    }

    @Get("/{id}")
    @Transactional
    public HttpResponse<Automovel> obter(@PathVariable Integer id, HttpRequest<?> request) {
        requireAuth(request);
        return automovelRepository.findById(id).map(HttpResponse::ok).orElseGet(() -> HttpResponse.status(HttpStatus.NOT_FOUND));
    }

    @Post
    @Transactional
    public HttpResponse<Automovel> criar(@Body AutomovelUpsertRequest body, HttpRequest<?> request) {
        requireCliente(request);
        Automovel a = new Automovel();
        a.setMatricula(body.matricula());
        a.setAno(body.ano());
        a.setMarca(body.marca());
        a.setModelo(body.modelo());
        a.setPlaca(body.placa());
        a.setEmpresa(null);
        automovelRepository.save(a);
        return HttpResponse.created(a);
    }

    @Put("/{id}")
    @Transactional
    public HttpResponse<Automovel> atualizar(
        @PathVariable Integer id,
        @Body AutomovelUpsertRequest body,
        HttpRequest<?> request
    ) {
        requireCliente(request);
        Automovel a = automovelRepository.findById(id).orElseThrow();
        a.setMatricula(body.matricula());
        a.setAno(body.ano());
        a.setMarca(body.marca());
        a.setModelo(body.modelo());
        a.setPlaca(body.placa());
        a.setEmpresa(null);
        automovelRepository.save(a);
        return HttpResponse.ok(a);
    }

    @Delete("/{id}")
    @Transactional
    public HttpResponse<?> remover(@PathVariable Integer id, HttpRequest<?> request) {
        requireCliente(request);
        automovelRepository.deleteById(id);
        return HttpResponse.noContent();
    }

    private void requireAuth(HttpRequest<?> request) {
        request.getAttribute("userId", Integer.class).orElseThrow(
            () -> new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado")
        );
    }

    private void requireCliente(HttpRequest<?> request) {
        requireAuth(request);
        if (!Roles.CLIENTE.equals(request.getAttribute("userRole", String.class).orElse(""))) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.FORBIDDEN, "Apenas clientes");
        }
    }
}
