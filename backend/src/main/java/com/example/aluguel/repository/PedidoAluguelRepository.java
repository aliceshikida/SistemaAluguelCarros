package com.example.aluguel.repository;

import com.example.aluguel.model.PedidoAluguel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByCliente_Id(Long clienteId);
}
