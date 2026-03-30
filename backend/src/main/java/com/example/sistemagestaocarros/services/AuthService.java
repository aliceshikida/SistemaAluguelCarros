package com.example.sistemagestaocarros.services;

import com.example.sistemagestaocarros.AgenteTipos;
import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.LoginRequest;
import com.example.sistemagestaocarros.dto.LoginResponse;
import com.example.sistemagestaocarros.dto.RegisterClienteRequest;
import com.example.sistemagestaocarros.dto.RendimentoItemDto;
import com.example.sistemagestaocarros.models.Agente;
import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.models.Empregador;
import com.example.sistemagestaocarros.models.Rendimento;
import com.example.sistemagestaocarros.models.Usuario;
import com.example.sistemagestaocarros.repositories.ClienteRepository;
import com.example.sistemagestaocarros.repositories.EmpregadorRepository;
import com.example.sistemagestaocarros.repositories.RendimentoRepository;
import com.example.sistemagestaocarros.repositories.UsuarioRepository;
import com.example.sistemagestaocarros.security.JwtTokenService;
import com.example.sistemagestaocarros.security.PasswordHasher;
import io.micronaut.context.annotation.Value;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final EmpregadorRepository empregadorRepository;
    private final RendimentoRepository rendimentoRepository;
    private final PasswordHasher passwordHasher;
    private final JwtTokenService jwtTokenService;
    private final long expirationSeconds;

    public AuthService(
        UsuarioRepository usuarioRepository,
        ClienteRepository clienteRepository,
        EmpregadorRepository empregadorRepository,
        RendimentoRepository rendimentoRepository,
        PasswordHasher passwordHasher,
        JwtTokenService jwtTokenService,
        @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.empregadorRepository = empregadorRepository;
        this.rendimentoRepository = rendimentoRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
        this.expirationSeconds = expirationSeconds;
    }

    public LoginResponse login(LoginRequest req) {
        Usuario u = usuarioRepository.findByLogin(req.login())
            .orElseThrow(() -> new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos"));
        if (!passwordHasher.matches(req.senha(), u.getSenha())) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos");
        }
        String role;
        String tipoAgente = null;
        if (u instanceof Cliente) {
            role = Roles.CLIENTE;
        } else if (u instanceof Agente a) {
            role = Roles.AGENTE;
            tipoAgente = a.getTipo();
        } else {
            role = "USUARIO";
        }
        String token = jwtTokenService.generate(u.getId(), role, tipoAgente);
        return new LoginResponse(
            token,
            "Bearer",
            expirationSeconds,
            role,
            u.getNome(),
            u.getId(),
            tipoAgente
        );
    }

    @Transactional
    public Cliente registerCliente(RegisterClienteRequest req) {
        if (usuarioRepository.findByLogin(req.login()).isPresent()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login já cadastrado");
        }
        List<RendimentoItemDto> rends = req.rendimentos() != null ? req.rendimentos() : List.of();
        if (rends.size() > 3) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Máximo de 3 rendimentos");
        }
        Cliente c = new Cliente();
        c.setNome(req.nome());
        c.setEndereco(req.endereco());
        c.setLogin(req.login());
        c.setSenha(passwordHasher.hash(req.senha()));
        c.setRg(req.rg());
        c.setCpf(req.cpf());
        c.setProfissao(req.profissao());
        clienteRepository.save(c);

        for (RendimentoItemDto r : rends) {
            Empregador emp = new Empregador();
            emp.setNome(r.empregadorNome());
            empregadorRepository.save(emp);
            Rendimento ren = new Rendimento();
            ren.setCliente(c);
            ren.setEmpregador(emp);
            ren.setValor(r.valor());
            ren.setDescricao(r.descricao());
            rendimentoRepository.save(ren);
        }
        return clienteRepository.findById(c.getId()).orElse(c);
    }
}
