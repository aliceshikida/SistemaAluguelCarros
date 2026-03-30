package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Empregador;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface EmpregadorRepository extends CrudRepository<Empregador, Integer> {
}
