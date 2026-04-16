package com.example.aluguel.controller;

import com.example.aluguel.dto.PerfilUsuarioResponse;
import com.example.aluguel.repository.BancoRepository;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.EmpresaRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.exceptions.HttpStatusException;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;

@Controller("/api")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class PerfilController {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;

    public PerfilController(
        ClienteRepository clienteRepository,
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository
    ) {
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
    }

    @Get("/me")
    public PerfilUsuarioResponse me(Authentication authentication) {
        String login = authentication.getName();
        PerfilUsuarioResponse r = new PerfilUsuarioResponse();
        var cliente = clienteRepository.findByUsuario_Login(login);
        if (cliente.isPresent()) {
            r.setPapel("CLIENTE");
            r.setClienteId(cliente.get().getId());
            return r;
        }
        var empresa = empresaRepository.findByUsuario_Login(login);
        if (empresa.isPresent()) {
            r.setPapel("EMPRESA");
            r.setEmpresaId(empresa.get().getId());
            return r;
        }
        var banco = bancoRepository.findByUsuario_Login(login);
        if (banco.isPresent()) {
            r.setPapel("BANCO");
            r.setBancoId(banco.get().getId());
            return r;
        }
        throw new HttpStatusException(HttpStatus.NOT_FOUND, "Perfil não encontrado para o usuário");
    }
}
