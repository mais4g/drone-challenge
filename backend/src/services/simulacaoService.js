const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { bfs } = require('./rotaService');
const { grid } = require('../data/cidade'); 

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simularEntrega(pedido, drone) {
  const start = [drone.posX, drone.posY];
  const end = [pedido.localizacao.linha, pedido.localizacao.coluna];

  // Calcula rota no grid
  const caminho = bfs(grid, start, end);

  if (!caminho) {
    console.log(`❌ Drone ${drone.modelo} não encontrou rota para pedido ${pedido.id}`);
    return;
  }

  console.log(`🚀 Iniciando entrega do pedido ${pedido.id} com drone ${drone.modelo}`);

  // Atualiza status inicial
  await prisma.pedido.update({
    where: { id: pedido.id },
    data: { status: 'CARREGANDO' }
  });
  await prisma.drone.update({
    where: { id: drone.id },
    data: { status: 'CARREGANDO' }
  });

  await esperar(2000); // 2s carregando

  // Percorre o caminho célula por célula
  for (const [linha, coluna] of caminho) {
    // Consome 1% de bateria por célula
    drone.bateria -= 1;

    await prisma.drone.update({
      where: { id: drone.id },
      data: { posX: linha, posY: coluna, bateria: drone.bateria, status: 'EM_VOO' }
    });

    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { status: 'EM_VOO' }
    });

    await prisma.rota.create({
    data: {
        pedidoId: pedido.id,
        posX: linha,
        posY: coluna
    }
    });

    console.log(`✈️ Drone ${drone.modelo} moveu para (${linha}, ${coluna}) | Bateria: ${drone.bateria}%`);

    // Se a bateria ficar baixa, aborta entrega e retorna à base
    if (drone.bateria <= 20) {
      console.log(`⚠️ Drone ${drone.modelo} com bateria baixa! Retornando à base...`);
      await retornarParaBase(drone);
      return;
    }

    await esperar(1000); // 1s por célula
  }

  // Entregando
  await prisma.pedido.update({
    where: { id: pedido.id },
    data: { status: 'ENTREGANDO' }
  });
  await prisma.drone.update({
    where: { id: drone.id },
    data: { status: 'ENTREGANDO' }
  });

  console.log(`📦 Pedido ${pedido.id} sendo entregue...`);
  await esperar(2000);

  // Finaliza entrega
  await prisma.pedido.update({
    where: { id: pedido.id },
    data: { status: 'ENTREGUE' }
  });
  await prisma.drone.update({
    where: { id: drone.id },
    data: { status: 'OCIOSO' }
  });

  console.log(`✅ Pedido ${pedido.id} entregue com sucesso!`);
}

async function retornarParaBase(drone) {
  await prisma.drone.update({
    where: { id: drone.id },
    data: { posX: 0, posY: 0, status: 'RECARREGANDO' }
  });

  console.log(`🔋 Drone ${drone.modelo} recarregando...`);
  await esperar(5000); // 5s para recarregar

  await prisma.drone.update({
    where: { id: drone.id },
    data: { bateria: 100, status: 'OCIOSO' }
  });

  console.log(`✅ Drone ${drone.modelo} totalmente recarregado!`);
}

module.exports = {
  simularEntrega,
  retornarParaBase
};