package com.example.aluguel.repository;

import com.example.aluguel.model.Banco;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface BancoRepository extends JpaRepository<Banco, Long> {

    Optional<Banco> findByUsuario_Login(String login);
}
