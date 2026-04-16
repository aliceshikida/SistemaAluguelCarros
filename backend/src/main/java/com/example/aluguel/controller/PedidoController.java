package com.example.aluguel.controller;

import com.example.aluguel.dto.DecisaoPedidoRequest;
import com.example.aluguel.dto.PedidoCreateRequest;
import com.example.aluguel.dto.PedidoResponse;
import com.example.aluguel.dto.PedidoUpdateRequest;
import com.example.aluguel.security.Roles;
import com.example.aluguel.service.PedidoService;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/pedidos")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @Get
    public List<PedidoResponse> listar(Authentication authentication) {
        return pedidoService.listar(authentication);
    }

    @Get("/{id}")
    public PedidoResponse obter(@PathVariable Long id, Authentication authentication) {
        return pedidoService.buscar(id, authentication);
    }

    @Post
    @Secured(Roles.CLIENTE)
    public HttpResponse<PedidoResponse> criar(@Body @Valid PedidoCreateRequest request, Authentication authentication) {
        PedidoResponse body = pedidoService.criar(request, authentication);
        return HttpResponse.created(body).header(HttpHeaders.LOCATION, "/api/pedidos/" + body.getId());
    }

    @Put("/{id}")
    @Secured(Roles.CLIENTE)
    public PedidoResponse atualizar(
        @PathVariable Long id,
        @Body @Valid PedidoUpdateRequest request,
        Authentication authentication
    ) {
        return pedidoService.atualizar(id, request, authentication);
    }

    @Post("/{id}/cancelar")
    @Secured(Roles.CLIENTE)
    public PedidoResponse cancelar(@PathVariable Long id, Authentication authentication) {
        return pedidoService.cancelar(id, authentication);
    }

    @Post("/{id}/iniciar-analise")
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public PedidoResponse iniciarAnalise(@PathVariable Long id, Authentication authentication) {
        return pedidoService.iniciarAnaliseFinanceira(id, authentication);
    }

    @Post("/{id}/decisao")
    @Secured({Roles.EMPRESA, Roles.BANCO})
    public PedidoResponse decidir(
        @PathVariable Long id,
        @Body @Valid DecisaoPedidoRequest request,
        Authentication authentication
    ) {
        return pedidoService.decidir(id, request, authentication);
    }
}
