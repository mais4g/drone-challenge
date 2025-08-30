const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { simularEntrega } = require('./simulacaoService');

async function alocarPedidos() {
  // 1. Buscar pedidos aguardando
  const pedidos = await prisma.pedido.findMany({
    where: { status: 'AGUARDANDO_ALOCACAO' },
    include: { localizacao: true },
    orderBy: [
      { prioridade: 'desc' }, // ALTA > MEDIA > BAIXA
      { dataCriacao: 'asc' }  // mais antigo primeiro
    ]
  });

  // 2. Buscar drones disponíveis
  const drones = await prisma.drone.findMany({
    where: { status: 'OCIOSO' }
  });

  for (const pedido of pedidos) {
    // Tenta encontrar um drone adequado
    const drone = drones.find(d => d.capacidadeKg >= pedido.pesoKg);

    if (drone) {
      // Atualiza pedido e drone para "reservado"
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: { status: 'RESERVADO' }
      });

      await prisma.drone.update({
        where: { id: drone.id },
        data: { status: 'RESERVADO' }
      });

      console.log(`📌 Pedido ${pedido.id} alocado no drone ${drone.modelo}`);

      // Dispara simulação (não bloqueia o loop)
      simularEntrega(pedido, drone);
    } else {
      console.log(`⏳ Nenhum drone disponível para pedido ${pedido.id}`);
    }
  }
}

module.exports = {
  alocarPedidos
};