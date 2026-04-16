package com.example.aluguel.security;

import com.example.aluguel.model.Usuario;
import com.example.aluguel.repository.UsuarioRepository;
import io.micronaut.core.annotation.NonNull;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.AuthenticationFailureReason;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import io.micronaut.security.authentication.provider.HttpRequestAuthenticationProvider;
import jakarta.inject.Singleton;

import java.util.List;

@Singleton
public class UsuarioAuthenticationProvider implements HttpRequestAuthenticationProvider<Object> {

    private final UsuarioRepository usuarioRepository;
    private final PasswordHasher passwordHasher;

    public UsuarioAuthenticationProvider(UsuarioRepository usuarioRepository, PasswordHasher passwordHasher) {
        this.usuarioRepository = usuarioRepository;
        this.passwordHasher = passwordHasher;
    }

    @Override
    public AuthenticationResponse authenticate(
        @Nullable HttpRequest<Object> httpRequest,
        @NonNull AuthenticationRequest<String, String> authenticationRequest
    ) {
        String login = authenticationRequest.getIdentity();
        String senha = authenticationRequest.getSecret();
        return usuarioRepository.findByLogin(login)
            .filter(u -> passwordHasher.matches(senha, u.getSenhaHash()))
            .map(this::sucesso)
            .orElseGet(() -> AuthenticationResponse.failure(AuthenticationFailureReason.CREDENTIALS_DO_NOT_MATCH));
    }

    private AuthenticationResponse sucesso(Usuario usuario) {
        String role = Roles.fromPapel(usuario.getPapel());
        return AuthenticationResponse.success(usuario.getLogin(), List.of(role));
    }
}
