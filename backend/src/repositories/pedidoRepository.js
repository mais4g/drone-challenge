const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criar(novoPedido) {
  return await prisma.pedido.create({
    data: {
      pesoKg: novoPedido.pesoKg,
      prioridade: novoPedido.prioridade,
      status: novoPedido.status,
      localizacao: {
        create: {
          linha: novoPedido.localizacao.linha,
          coluna: novoPedido.localizacao.coluna
        }
      }
    },
    include: { localizacao: true }
  });
}

async function obterTodos() {
  return await prisma.pedido.findMany({ include: { localizacao: true } });
}

async function obterPorId(id) {
  return await prisma.pedido.findUnique({
    where: { id },
    include: { localizacao: true }
  });
}

async function atualizarStatus(id, novoStatus) {
  return await prisma.pedido.update({
    where: { id },
    data: { status: novoStatus }
  });
}

module.exports = {
  criar,
  obterTodos,
  obterPorId,
  atualizarStatus
};