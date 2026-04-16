package com.example.aluguel.repository;

import com.example.aluguel.model.ContratoCredito;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface ContratoCreditoRepository extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByContrato_Id(Long contratoId);

    boolean existsByContrato_Id(Long contratoId);
}
