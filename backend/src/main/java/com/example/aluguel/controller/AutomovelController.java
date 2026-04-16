package com.example.aluguel.controller;

import com.example.aluguel.dto.AutomovelRequest;
import com.example.aluguel.dto.AutomovelResponse;
import com.example.aluguel.security.Roles;
import com.example.aluguel.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/automoveis")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @Get
    public List<AutomovelResponse> listar() {
        return automovelService.listar();
    }

    @Get("/{id}")
    public AutomovelResponse obter(@PathVariable Long id) {
        return automovelService.buscar(id);
    }

    @Post
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public HttpResponse<AutomovelResponse> criar(@Body @Valid AutomovelRequest request) {
        AutomovelResponse body = automovelService.criar(request);
        return HttpResponse.created(body).header(io.micronaut.http.HttpHeaders.LOCATION, "/api/automoveis/" + body.getId());
    }

    @Put("/{id}")
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public AutomovelResponse atualizar(@PathVariable Long id, @Body @Valid AutomovelRequest request) {
        return automovelService.atualizar(id, request);
    }

    @Delete("/{id}")
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public HttpResponse<Void> remover(@PathVariable Long id) {
        automovelService.remover(id);
        return HttpResponse.noContent();
    }
}
