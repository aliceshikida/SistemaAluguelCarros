package com.example.sistemagestaocarros.controllers;

import com.example.sistemagestaocarros.models.Empresa;
import com.example.sistemagestaocarros.repositories.EmpresaRepository;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import jakarta.transaction.Transactional;
import java.util.List;

@Controller("/api/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    public EmpresaController(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Get("/")
    @Transactional
    public List<Empresa> listar(HttpRequest<?> request) {
        if (request.getAttribute("userId", Integer.class).isEmpty()) {
            throw new io.micronaut.http.exceptions.HttpStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        return (List<Empresa>) empresaRepository.findAll();
    }
}
