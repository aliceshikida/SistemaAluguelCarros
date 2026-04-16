package com.example.aluguel.controller;

import com.example.aluguel.dto.ClienteCreateRequest;
import com.example.aluguel.dto.ClienteRegistroRequest;
import com.example.aluguel.dto.ClienteResponse;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@MicronautTest(environments = "test")
class ClienteControllerTest {

    @Inject
    @Client("/")
    HttpClient httpClient;

    @Test
    void fluxoBasicoCrudClienteComJwt() {
        ClienteCreateRequest perfil = new ClienteCreateRequest();
        perfil.setNome("Maria Silva");
        perfil.setCpf("12345678909");
        perfil.setRg("MG1234567");
        perfil.setEndereco("Rua A, 10");
        perfil.setProfissao("Engenheira");
        perfil.setEmpregadores(List.of());
        perfil.setRendimentos(List.of());

        ClienteRegistroRequest registro = new ClienteRegistroRequest();
        registro.setLogin("maria");
        registro.setSenha("secret12");
        registro.setPerfil(perfil);

        HttpResponse<ClienteResponse> created = httpClient.toBlocking().exchange(
            HttpRequest.POST("/api/auth/register/cliente", registro).contentType(MediaType.APPLICATION_JSON_TYPE),
            ClienteResponse.class
        );
        assertEquals(HttpStatus.CREATED, created.getStatus());
        assertNotNull(created.body());
        Long id = created.body().getId();

        String token = login("maria", "secret12");

        ClienteResponse[] lista = httpClient.toBlocking().retrieve(
            HttpRequest.GET("/api/clientes").bearerAuth(token),
            ClienteResponse[].class
        );
        assertEquals(1, lista.length);

        ClienteResponse one = httpClient.toBlocking().retrieve(
            HttpRequest.GET("/api/clientes/" + id).bearerAuth(token),
            ClienteResponse.class
        );
        assertEquals("Maria Silva", one.getNome());
        assertEquals("maria", one.getLogin());

        HttpResponse<?> deleted = httpClient.toBlocking().exchange(
            HttpRequest.DELETE("/api/clientes/" + id).bearerAuth(token)
        );
        assertEquals(HttpStatus.NO_CONTENT, deleted.getStatus());
    }

    private String login(String username, String password) {
        Map<String, String> body = Map.of("username", username, "password", password);
        @SuppressWarnings("unchecked")
        Map<String, Object> tokenResponse = httpClient.toBlocking().retrieve(
            HttpRequest.POST("/api/auth/login", body).contentType(MediaType.APPLICATION_JSON_TYPE),
            Map.class
        );
        Object access = tokenResponse.get("access_token");
        if (access == null) {
            access = tokenResponse.get("accessToken");
        }
        assertNotNull(access, "Resposta de login deve conter access_token");
        return access.toString();
    }
}
