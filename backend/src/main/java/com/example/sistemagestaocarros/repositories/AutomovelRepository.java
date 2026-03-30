package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface AutomovelRepository extends CrudRepository<Automovel, Integer> {
}
