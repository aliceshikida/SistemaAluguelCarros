package com.example.sistemagestaocarros.repositories;

import com.example.sistemagestaocarros.models.Cliente;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface ClienteRepository extends CrudRepository<Cliente, Integer> {
    // Só de estender CrudRepository, o Micronaut já cria automaticamente 
    // métodos como: save(), findAll(), findById(), update() e deleteById()
}