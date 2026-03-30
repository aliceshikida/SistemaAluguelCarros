package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Banco;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface BancoRepository extends CrudRepository<Banco, Integer> {
}
