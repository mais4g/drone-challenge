const droneRepository = require('../repositories/droneRepository');

async function criar(droneData) {
  if (!droneData.modelo || !droneData.capacidadeKg || !droneData.autonomiaKm) {
    throw new Error('Dados obrigatórios do drone estão faltando.');
  }

  return await droneRepository.criar({
    modelo: droneData.modelo,
    capacidadeKg: droneData.capacidadeKg,
    autonomiaKm: droneData.autonomiaKm,
    status: droneData.status || 'OCIOSO',
    bateria: droneData.bateria || 100,
    posX: droneData.posX || 0,
    posY: droneData.posY || 0
  });
}

async function listarTodos() {
  return await droneRepository.obterTodos();
}

async function buscarPorId(id) {
  const drone = await droneRepository.obterPorId(id);
  if (!drone) throw new Error('Drone não encontrado');
  return drone;
}

async function atualizar(id, dadosAtualizados) {
  return await droneRepository.atualizar(id, dadosAtualizados);
}

async function remover(id) {
  return await droneRepository.remover(id);
}

module.exports = {
  criar,
  listarTodos,
  buscarPorId,
  atualizar,
  remover
};