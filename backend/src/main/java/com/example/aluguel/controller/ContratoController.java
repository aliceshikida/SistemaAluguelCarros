package com.example.aluguel.controller;

import com.example.aluguel.dto.ContratoCreateRequest;
import com.example.aluguel.dto.ContratoCreditoRequest;
import com.example.aluguel.dto.ContratoResponse;
import com.example.aluguel.security.Roles;
import com.example.aluguel.service.ContratoService;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/contratos")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @Get
    public List<ContratoResponse> listar(Authentication authentication) {
        return contratoService.listar(authentication);
    }

    @Get("/{id}")
    public ContratoResponse obter(@PathVariable Long id, Authentication authentication) {
        return contratoService.buscar(id, authentication);
    }

    @Post
    @Secured(Roles.EMPRESA)
    public HttpResponse<ContratoResponse> criar(@Body @Valid ContratoCreateRequest request, Authentication authentication) {
        ContratoResponse body = contratoService.criar(request, authentication);
        return HttpResponse.created(body).header(HttpHeaders.LOCATION, "/api/contratos/" + body.getId());
    }

    @Post("/{contratoId}/credito")
    @Secured(Roles.BANCO)
    public ContratoResponse adicionarCredito(
        @PathVariable Long contratoId,
        @Body @Valid ContratoCreditoRequest request,
        Authentication authentication
    ) {
        return contratoService.adicionarCredito(contratoId, request, authentication);
    }
}
