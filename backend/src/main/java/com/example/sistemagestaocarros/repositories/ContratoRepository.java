package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Contrato;
import com.example.sistemagestaocarros.models.PedidoAluguel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;

@Repository
public interface ContratoRepository extends CrudRepository<Contrato, Integer> {
    Optional<Contrato> findByPedidoAluguel(PedidoAluguel pedido);
}
