const droneService = require('../services/droneService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarDrone(request, reply) {
  try {
    const novoDrone = await droneService.criar(request.body);
    return reply.code(201).send(novoDrone);
  } catch (error) {
    return reply.code(400).send({ error: error.message });
  }
}

async function listarDrones(request, reply) {
  const drones = await droneService.listarTodos();
  return reply.send(drones);
}

async function buscarDronePorId(request, reply) {
  try {
    const drone = await droneService.buscarPorId(request.params.id);
    return reply.send(drone);
  } catch (error) {
    return reply.code(404).send({ error: error.message });
  }
}

async function atualizarDrone(request, reply) {
  try {
    const droneAtualizado = await droneService.atualizar(
      request.params.id,
      request.body
    );
    return reply.send(droneAtualizado);
  } catch (error) {
    return reply.code(400).send({ error: error.message });
  }
}

async function removerDrone(request, reply) {
  try {
    await droneService.remover(request.params.id);
    return reply.code(204).send();
  } catch (error) {
    return reply.code(404).send({ error: error.message });
  }
}

async function statusFrota(request, reply) {
  const total = await prisma.drone.count();
  const ociosos = await prisma.drone.count({ where: { status: 'OCIOSO' } });
  const emVoo = await prisma.drone.count({ where: { status: 'EM_VOO' } });
  const recarregando = await prisma.drone.count({ where: { status: 'RECARREGANDO' } });

  return reply.send({
    total,
    ociosos,
    emVoo,
    recarregando
  });
}

module.exports = {
  criarDrone,
  listarDrones,
  buscarDronePorId,
  atualizarDrone,
  removerDrone,
  statusFrota 
};