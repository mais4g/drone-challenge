const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criar(droneData) {
  return await prisma.drone.create({ data: droneData });
}

async function obterTodos() {
  return await prisma.drone.findMany();
}

async function obterPorId(id) {
  return await prisma.drone.findUnique({ where: { id } });
}

async function atualizar(id, dadosAtualizados) {
  return await prisma.drone.update({
    where: { id },
    data: dadosAtualizados
  });
}

async function remover(id) {
  return await prisma.drone.delete({ where: { id } });
}

module.exports = {
  criar,
  obterTodos,
  obterPorId,
  atualizar,
  remover
};