const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function obterRotaPorPedido(request, reply) {
  try {
    const { id } = request.params;

    const rota = await prisma.rota.findMany({
      where: { pedidoId: id },
      orderBy: { timestamp: 'asc' }
    });

    if (!rota || rota.length === 0) {
      return reply.code(404).send({ error: 'Nenhuma rota encontrada para este pedido' });
    }

    return reply.send(rota);
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
}

module.exports = {
  obterRotaPorPedido
};