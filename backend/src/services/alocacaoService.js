const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { simularEntrega } = require('./simulacaoService');

async function alocarPedidos() {
  const pedidos = await prisma.pedido.findMany({
    where: { status: 'AGUARDANDO_ALOCACAO' },
    include: { localizacao: true },
    orderBy: [
      { prioridade: 'desc' }, // ALTA > MEDIA > BAIXA
      { dataCriacao: 'asc' }  // mais antigo primeiro
    ]
  });

  const drones = await prisma.drone.findMany({
    where: { status: 'OCIOSO' }
  });

  for (const pedido of pedidos) {
    const drone = drones.find(d => d.capacidadeKg >= pedido.pesoKg);

    if (drone) {
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { status: 'RESERVADO' }
      });

      await prisma.drone.update({
        where: { id: drone.id },
        data: { status: 'RESERVADO' }
      });

      console.log(`📌 Pedido ${pedido.id} alocado no drone ${drone.modelo}`);

      simularEntrega(pedido, drone);
    } else {
      console.log(`⏳ Nenhum drone disponível para pedido ${pedido.id}`);
    }
  }
}

module.exports = {
  alocarPedidos
};