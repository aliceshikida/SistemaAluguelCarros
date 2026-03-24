const { run, all, get } = require('./baseRepository');

function createCar(car) {
  return run(
    `INSERT INTO cars (matricula, ano, marca, modelo, placa, owner_type, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [car.matricula, car.ano, car.marca, car.modelo, car.placa, car.owner_type, car.owner_id || null]
  );
}

function listCars() {
  return all('SELECT * FROM cars ORDER BY id');
}

function findCarById(id) {
  return get('SELECT * FROM cars WHERE id = ?', [id]);
}

function updateOwnership(id, ownerType, ownerId) {
  return run('UPDATE cars SET owner_type = ?, owner_id = ? WHERE id = ?', [ownerType, ownerId || null, id]);
}

module.exports = { createCar, listCars, findCarById, updateOwnership };
