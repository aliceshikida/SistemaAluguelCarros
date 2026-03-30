package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Usuario;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Integer> {
    Optional<Usuario> findByLogin(String login);
}
