package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Agente;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;

@Repository
public interface AgenteRepository extends CrudRepository<Agente, Integer> {

    Optional<Agente> findByLogin(String login);
}
