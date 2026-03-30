package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Empresa;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface EmpresaRepository extends CrudRepository<Empresa, Integer> {
}
