package com.example.aluguel.repository;

import com.example.aluguel.model.Contrato;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    Optional<Contrato> findByPedido_Id(Long pedidoId);

    boolean existsByPedido_Id(Long pedidoId);

    List<Contrato> findByEmpresa_Id(Long empresaId);

    @Query("SELECT c FROM Contrato c WHERE c.pedido.cliente.id = :clienteId")
    List<Contrato> findAllByPedidoClienteId(Long clienteId);
}
