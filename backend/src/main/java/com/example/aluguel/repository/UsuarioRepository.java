package com.example.aluguel.repository;

import com.example.aluguel.model.Papel;
import com.example.aluguel.model.Usuario;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);

    boolean existsByLogin(String login);

    Optional<Usuario> findByLoginAndPapel(String login, Papel papel);
}
