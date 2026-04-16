package com.example.aluguel.controller;

import com.example.aluguel.dto.ClienteRegistroRequest;
import com.example.aluguel.dto.ClienteResponse;
import com.example.aluguel.dto.ClienteUpdateRequest;
import com.example.aluguel.security.Roles;
import com.example.aluguel.service.ClienteService;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/clientes")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Get
    public List<ClienteResponse> listar(Authentication authentication) {
        return clienteService.listar(authentication);
    }

    @Get("/{id}")
    public ClienteResponse obter(@PathVariable Long id, Authentication authentication) {
        return clienteService.buscar(id, authentication);
    }

    @Post
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public HttpResponse<ClienteResponse> criarPorAgente(@Body @Valid ClienteRegistroRequest request) {
        ClienteResponse body = clienteService.registrarNovoCliente(request);
        return HttpResponse.created(body).header(HttpHeaders.LOCATION, "/api/clientes/" + body.getId());
    }

    @Put("/{id}")
    public ClienteResponse atualizar(
        @PathVariable Long id,
        @Body @Valid ClienteUpdateRequest request,
        Authentication authentication
    ) {
        return clienteService.atualizar(id, request, authentication);
    }

    @Delete("/{id}")
    public HttpResponse<Void> remover(@PathVariable Long id, Authentication authentication) {
        clienteService.remover(id, authentication);
        return HttpResponse.noContent();
    }
}
