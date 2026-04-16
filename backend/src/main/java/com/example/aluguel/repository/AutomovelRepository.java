package com.example.aluguel.repository;

import com.example.aluguel.model.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    boolean existsByPlacaIgnoreCase(String placa);

    Optional<Automovel> findByPlacaIgnoreCase(String placa);
}
