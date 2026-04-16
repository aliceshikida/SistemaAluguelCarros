package com.example.aluguel.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Serdeable
public class ClienteRegistroRequest {

    @NotBlank
    @Size(min = 3, max = 64)
    private String login;

    @NotBlank
    @Size(min = 6, max = 120)
    private String senha;

    @Valid
    @NotNull
    private ClienteCreateRequest perfil;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public ClienteCreateRequest getPerfil() {
        return perfil;
    }

    public void setPerfil(ClienteCreateRequest perfil) {
        this.perfil = perfil;
    }
}
