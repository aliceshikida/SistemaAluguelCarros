package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Cliente;
import com.example.sistemagestaocarros.models.PedidoAluguel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;

@Repository
public interface PedidoAluguelRepository extends CrudRepository<PedidoAluguel, Integer> {
    List<PedidoAluguel> findByCliente(Cliente cliente);
}
