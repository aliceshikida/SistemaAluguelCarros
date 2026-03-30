package com.example.sistemagestaocarros.controllers;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller("/")
public class HomeController {

    private static final MediaType TEXT_PLAIN_UTF8 = MediaType.of("text/plain;charset=UTF-8");

    @Get
    public HttpResponse<String> index() {
        return HttpResponse
            .ok("SistemaAluguelCarros - Micronaut API running. Try GET /api/clientes")
            .contentType(TEXT_PLAIN_UTF8);
    }
}
