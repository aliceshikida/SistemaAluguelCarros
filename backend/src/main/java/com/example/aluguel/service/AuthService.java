package com.example.aluguel.service;

import com.example.aluguel.dto.ClienteResponse;
import com.example.aluguel.dto.ClienteRegistroRequest;
import com.example.aluguel.dto.RegisterAgenteRequest;
import com.example.aluguel.model.Banco;
import com.example.aluguel.model.Empresa;
import com.example.aluguel.model.Papel;
import com.example.aluguel.model.Usuario;
import com.example.aluguel.repository.BancoRepository;
import com.example.aluguel.repository.EmpresaRepository;
import com.example.aluguel.repository.UsuarioRepository;
import com.example.aluguel.security.PasswordHasher;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

@Singleton
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final BancoRepository bancoRepository;
    private final PasswordHasher passwordHasher;
    private final ClienteService clienteService;

    public AuthService(
        UsuarioRepository usuarioRepository,
        EmpresaRepository empresaRepository,
        BancoRepository bancoRepository,
        PasswordHasher passwordHasher,
        ClienteService clienteService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.bancoRepository = bancoRepository;
        this.passwordHasher = passwordHasher;
        this.clienteService = clienteService;
    }

    @Transactional
    public ClienteResponse registrarCliente(ClienteRegistroRequest request) {
        return clienteService.registrarNovoCliente(request);
    }

    @Transactional
    public void registrarAgente(RegisterAgenteRequest request) {
        Papel papel = request.getPapel();
        if (papel != Papel.EMPRESA && papel != Papel.BANCO) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Papel deve ser EMPRESA ou BANCO");
        }
        String login = request.getLogin().trim().toLowerCase();
        if (usuarioRepository.existsByLogin(login)) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Login já cadastrado");
        }
        Usuario u = new Usuario();
        u.setLogin(login);
        u.setSenhaHash(passwordHasher.hash(request.getSenha()));
        u.setPapel(papel);
        u = usuarioRepository.save(u);
        if (papel == Papel.EMPRESA) {
            Empresa e = new Empresa();
            e.setNome(request.getNomeInstituicao().trim());
            e.setUsuario(u);
            empresaRepository.save(e);
        } else {
            Banco b = new Banco();
            b.setNome(request.getNomeInstituicao().trim());
            b.setUsuario(u);
            bancoRepository.save(b);
        }
    }
}
