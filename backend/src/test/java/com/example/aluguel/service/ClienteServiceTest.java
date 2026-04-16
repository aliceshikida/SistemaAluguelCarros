package com.example.aluguel.service;

import com.example.aluguel.dto.RendimentoItemDto;
import com.example.aluguel.repository.ClienteRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    ClienteRepository clienteRepository;

    @InjectMocks
    ClienteService clienteService;

    @Test
    void validarQuantidadeRendimentos_rejeitaMaisDeTres() {
        List<RendimentoItemDto> lista = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            RendimentoItemDto r = new RendimentoItemDto();
            r.setValor(BigDecimal.TEN);
            lista.add(r);
        }
        HttpStatusException ex = assertThrows(HttpStatusException.class, () -> clienteService.validarQuantidadeRendimentos(lista));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    void validarQuantidadeRendimentos_aceitaTres() {
        List<RendimentoItemDto> lista = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            RendimentoItemDto r = new RendimentoItemDto();
            r.setValor(BigDecimal.ONE);
            lista.add(r);
        }
        clienteService.validarQuantidadeRendimentos(lista);
    }
}
