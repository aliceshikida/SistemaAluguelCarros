package com.example.sistemagestaocarros.services;

import com.example.sistemagestaocarros.Roles;
import com.example.sistemagestaocarros.dto.LoginRequest;
import com.example.sistemagestaocarros.dto.LoginResponse;
import com.example.sistemagestaocarros.dto.RegisterClienteRequest;
import com.example.sistemagestaocarros.dto.RendimentoItemDto;
import com.example.sistemagestaocarros.models.Agente;
import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.models.Empregador;
import com.example.sistemagestaocarros.models.Rendimento;
import com.example.sistemagestaocarros.repositories.AgenteRepository;
import com.example.sistemagestaocarros.repositories.ClienteRepository;
import com.example.sistemagestaocarros.repositories.EmpregadorRepository;
import com.example.sistemagestaocarros.repositories.RendimentoRepository;
import com.example.sistemagestaocarros.security.JwtTokenService;
import com.example.sistemagestaocarros.security.PasswordHasher;
import io.micronaut.context.annotation.Value;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Singleton
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final AgenteRepository agenteRepository;
    private final EmpregadorRepository empregadorRepository;
    private final RendimentoRepository rendimentoRepository;
    private final PasswordHasher passwordHasher;
    private final JwtTokenService jwtTokenService;
    private final long expirationSeconds;

    public AuthService(
        ClienteRepository clienteRepository,
        AgenteRepository agenteRepository,
        EmpregadorRepository empregadorRepository,
        RendimentoRepository rendimentoRepository,
        PasswordHasher passwordHasher,
        JwtTokenService jwtTokenService,
        @Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds
    ) {
        this.clienteRepository = clienteRepository;
        this.agenteRepository = agenteRepository;
        this.empregadorRepository = empregadorRepository;
        this.rendimentoRepository = rendimentoRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
        this.expirationSeconds = expirationSeconds;
    }

    private static String normalizeLogin(String raw) {
        String trimmed = raw.trim();
        // Se for um login composto apenas por dígitos/pontuação (CPF), salva/consulta sem máscara.
        if (trimmed.matches("[0-9.\\-\\s]+")) {
            String digitsOnly = trimmed.replaceAll("\\D", "");
            if (!digitsOnly.isEmpty()) {
                return digitsOnly;
            }
        }
        return trimmed;
    }

    private static String normalizeDigits(String raw) {
        String trimmed = raw == null ? "" : raw.trim();
        String digitsOnly = trimmed.replaceAll("\\D", "");
        return digitsOnly.isEmpty() ? trimmed : digitsOnly;
    }

    private static String formatCpf(String digits) {
        return digits.substring(0, 3) + "." + digits.substring(3, 6) + "." + digits.substring(6, 9) + "-" + digits.substring(9);
    }

    /**
     * Busca por variações de login para compatibilidade retroativa:
     * exato, somente dígitos e CPF formatado.
     */
    private static <T> Optional<T> findByLoginVariants(Function<String, Optional<T>> finder, String raw) {
        Optional<T> o = finder.apply(raw);
        if (o.isPresent()) {
            return o;
        }
        String normalized = normalizeLogin(raw);
        if (!normalized.equals(raw)) {
            o = finder.apply(normalized);
            if (o.isPresent()) {
                return o;
            }
        }
        if (normalized.matches("\\d{11}")) {
            String cpfMasked = formatCpf(normalized);
            if (!cpfMasked.equals(raw) && !cpfMasked.equals(normalized)) {
                return finder.apply(cpfMasked);
            }
        }
        return Optional.empty();
    }

    public LoginResponse login(LoginRequest req) {
        String login = req.login().trim();
        String loginDigits = normalizeDigits(login);

        var oc = findByLoginVariants(clienteRepository::findByLogin, login);
        if (oc.isEmpty() && loginDigits.matches("\\d{11}")) {
            oc = clienteRepository.findByCpf(loginDigits);
        }
        if (oc.isPresent()) {
            Cliente c = oc.get();
            if (!passwordHasher.matches(req.senha(), c.getSenha())) {
                throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos");
            }
            String token = jwtTokenService.generate(c.getId(), Roles.CLIENTE, null);
            return new LoginResponse(
                token,
                "Bearer",
                expirationSeconds,
                Roles.CLIENTE,
                c.getNome(),
                c.getId(),
                null
            );
        }

        var oa = findByLoginVariants(agenteRepository::findByLogin, login);
        if (oa.isPresent()) {
            Agente a = oa.get();
            if (!passwordHasher.matches(req.senha(), a.getSenha())) {
                throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos");
            }
            String token = jwtTokenService.generate(a.getId(), Roles.AGENTE, a.getTipo());
            return new LoginResponse(
                token,
                "Bearer",
                expirationSeconds,
                Roles.AGENTE,
                a.getNome(),
                a.getId(),
                a.getTipo()
            );
        }

        throw new HttpStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha inválidos");
    }

    @Transactional
    public Cliente registerCliente(RegisterClienteRequest req) {
        String login = normalizeLogin(req.login());
        if (clienteRepository.findByLogin(login).isPresent()
            || agenteRepository.findByLogin(login).isPresent()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Login já cadastrado");
        }
        List<RendimentoItemDto> rends = req.rendimentos() != null ? req.rendimentos() : List.of();
        if (rends.size() > 3) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Máximo de 3 rendimentos");
        }
        Cliente c = new Cliente();
        c.setNome(req.nome());
        c.setEndereco(req.endereco());
        c.setLogin(login);
        c.setSenha(passwordHasher.hash(req.senha()));
        c.setRg(req.rg());
        c.setCpf(normalizeDigits(req.cpf()));
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
