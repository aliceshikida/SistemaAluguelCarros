package com.example.aluguel.service;

import com.example.aluguel.dto.ClienteCreateRequest;
import com.example.aluguel.dto.ClienteRegistroRequest;
import com.example.aluguel.dto.ClienteResponse;
import com.example.aluguel.dto.ClienteUpdateRequest;
import com.example.aluguel.dto.EmpregadorItemDto;
import com.example.aluguel.dto.RendimentoItemDto;
import com.example.aluguel.model.Cliente;
import com.example.aluguel.model.Empregador;
import com.example.aluguel.model.Papel;
import com.example.aluguel.model.Rendimento;
import com.example.aluguel.model.Usuario;
import com.example.aluguel.repository.ClienteRepository;
import com.example.aluguel.repository.UsuarioRepository;
import com.example.aluguel.security.PasswordHasher;
import com.example.aluguel.security.Roles;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import io.micronaut.security.authentication.Authentication;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class ClienteService {

    static final int MAX_RENDIMENTOS = 3;

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordHasher passwordHasher;

    public ClienteService(
        ClienteRepository clienteRepository,
        UsuarioRepository usuarioRepository,
        PasswordHasher passwordHasher
    ) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
    }

    @Transactional
    public ClienteResponse registrarNovoCliente(ClienteRegistroRequest request) {
        ClienteCreateRequest perfil = request.getPerfil();
        validarQuantidadeRendimentos(perfil.getRendimentos() == null ? List.of() : perfil.getRendimentos());
        String login = request.getLogin().trim().toLowerCase();
        if (usuarioRepository.existsByLogin(login)) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "Login já cadastrado");
        }
        if (clienteRepository.existsByCpf(normalizarCpf(perfil.getCpf()))) {
            throw new HttpStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }
        Usuario u = new Usuario();
        u.setLogin(login);
        u.setSenhaHash(passwordHasher.hash(request.getSenha()));
        u.setPapel(Papel.CLIENTE);
        u = usuarioRepository.save(u);

        Cliente c = new Cliente();
        c.setUsuario(u);
        aplicarPerfilNovoCliente(c, perfil);
        Cliente salvo = clienteRepository.save(c);
        return paraResponse(salvo);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ClienteResponse> listar(Authentication authentication) {
        if (temPapel(authentication, Roles.CLIENTE)) {
            return clienteRepository.findByUsuario_Login(authentication.getName())
                .stream()
                .map(this::paraResponse)
                .collect(Collectors.toList());
        }
        if (temAgente(authentication)) {
            return clienteRepository.findAll().stream().map(this::paraResponse).collect(Collectors.toList());
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public ClienteResponse buscar(Long id, Authentication authentication) {
        Cliente c = clienteRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        garantirAcessoCliente(id, authentication);
        return paraResponse(c);
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteUpdateRequest request, Authentication authentication) {
        validarQuantidadeRendimentos(request.getRendimentos() == null ? List.of() : request.getRendimentos());
        Cliente c = clienteRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        garantirAcessoCliente(id, authentication);
        c.setNome(request.getNome().trim());
        c.setRg(request.getRg().trim());
        c.setEndereco(request.getEndereco().trim());
        c.setProfissao(request.getProfissao().trim());
        c.getEmpregadores().clear();
        c.getRendimentos().clear();
        anexarEmpregadores(c, request.getEmpregadores());
        anexarRendimentos(c, request.getRendimentos());
        Cliente salvo = clienteRepository.save(c);
        return paraResponse(salvo);
    }

    @Transactional
    public void remover(Long id, Authentication authentication) {
        Cliente c = clienteRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        garantirAcessoCliente(id, authentication);
        Usuario u = c.getUsuario();
        clienteRepository.delete(c);
        usuarioRepository.delete(u);
    }

    void validarQuantidadeRendimentos(List<RendimentoItemDto> rendimentos) {
        int n = rendimentos == null ? 0 : rendimentos.size();
        if (n > MAX_RENDIMENTOS) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "No máximo " + MAX_RENDIMENTOS + " rendimentos por cliente");
        }
    }

    private void garantirAcessoCliente(Long clienteId, Authentication authentication) {
        if (temAgente(authentication)) {
            return;
        }
        if (temPapel(authentication, Roles.CLIENTE)) {
            Cliente proprio = clienteRepository.findByUsuario_Login(authentication.getName())
                .orElseThrow(() -> new HttpStatusException(HttpStatus.FORBIDDEN, "Cliente não encontrado para o usuário"));
            if (!proprio.getId().equals(clienteId)) {
                throw new HttpStatusException(HttpStatus.FORBIDDEN, "Operação permitida apenas sobre o próprio cadastro");
            }
            return;
        }
        throw new HttpStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    private boolean temAgente(Authentication authentication) {
        return temPapel(authentication, Roles.EMPRESA) || temPapel(authentication, Roles.BANCO);
    }

    private boolean temPapel(Authentication authentication, String role) {
        return authentication != null && authentication.getRoles().contains(role);
    }

    private void aplicarPerfilNovoCliente(Cliente c, ClienteCreateRequest request) {
        c.setNome(request.getNome().trim());
        c.setCpf(normalizarCpf(request.getCpf()));
        c.setRg(request.getRg().trim());
        c.setEndereco(request.getEndereco().trim());
        c.setProfissao(request.getProfissao().trim());
        anexarEmpregadores(c, request.getEmpregadores());
        anexarRendimentos(c, request.getRendimentos());
    }

    private void anexarEmpregadores(Cliente c, List<EmpregadorItemDto> itens) {
        if (itens == null) {
            return;
        }
        for (EmpregadorItemDto dto : itens) {
            if (dto.getNome() == null || dto.getNome().isBlank()) {
                continue;
            }
            Empregador e = new Empregador();
            e.setNome(dto.getNome().trim());
            e.setCliente(c);
            c.getEmpregadores().add(e);
        }
    }

    private void anexarRendimentos(Cliente c, List<RendimentoItemDto> itens) {
        if (itens == null) {
            return;
        }
        for (RendimentoItemDto dto : itens) {
            Rendimento r = new Rendimento();
            r.setValor(dto.getValor());
            r.setDescricao(dto.getDescricao() == null ? null : dto.getDescricao().trim());
            r.setCliente(c);
            c.getRendimentos().add(r);
        }
    }

    private ClienteResponse paraResponse(Cliente c) {
        ClienteResponse r = new ClienteResponse();
        r.setId(c.getId());
        if (c.getUsuario() != null) {
            r.setUsuarioId(c.getUsuario().getId());
            r.setLogin(c.getUsuario().getLogin());
        }
        r.setNome(c.getNome());
        r.setCpf(c.getCpf());
        r.setRg(c.getRg());
        r.setEndereco(c.getEndereco());
        r.setProfissao(c.getProfissao());
        List<EmpregadorItemDto> edtos = new ArrayList<>();
        for (Empregador e : c.getEmpregadores()) {
            EmpregadorItemDto d = new EmpregadorItemDto();
            d.setId(e.getId());
            d.setNome(e.getNome());
            edtos.add(d);
        }
        r.setEmpregadores(edtos);
        List<RendimentoItemDto> rdtos = new ArrayList<>();
        for (Rendimento x : c.getRendimentos()) {
            RendimentoItemDto d = new RendimentoItemDto();
            d.setId(x.getId());
            d.setValor(x.getValor());
            d.setDescricao(x.getDescricao());
            rdtos.add(d);
        }
        r.setRendimentos(rdtos);
        return r;
    }

    private static String normalizarCpf(String cpf) {
        return cpf == null ? "" : cpf.replaceAll("\\D", "");
    }
}
