package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Rendimento;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface RendimentoRepository extends CrudRepository<Rendimento, Integer> {
}
