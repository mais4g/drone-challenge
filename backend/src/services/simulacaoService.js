const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { bfs } = require('./rotaService');
const { grid } = require('../data/cidade'); 
const broadcastService = require('./broadcastService');

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Atualiza o status/dados de um drone no banco e notifica os clientes via WebSocket.
 * @param {string} droneId - O ID do drone a ser atualizado.
 * @param {object} data - Os novos dados para o drone (ex: { status: 'EM_VOO', bateria: 99 }).
 */
async function atualizarDroneEBroadcast(droneId, data) {
  const droneAtualizado = await prisma.drone.update({
    where: { id: droneId },
    data: data,
  });
  broadcastService.broadcast({ type: 'DRONE_UPDATE', payload: droneAtualizado });
  return droneAtualizado;
}

/**
 * Atualiza o status de um pedido no banco e notifica os clientes via WebSocket.
 * @param {string} pedidoId - O ID do pedido a ser atualizado.
 * @param {string} status - O novo status do pedido.
 */
async function atualizarPedidoEBroadcast(pedidoId, status) {
  const pedidoAtualizado = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { status: status },
  });
  broadcastService.broadcast({ type: 'PEDIDO_UPDATE', payload: pedidoAtualizado });
  return pedidoAtualizado;
}

async function simularEntrega(pedido, drone) {
  const start = [drone.posX, drone.posY];
  const end = [pedido.localizacao.linha, pedido.localizacao.coluna];

  const caminho = bfs(grid, start, end);

  if (!caminho) {
    console.log(`❌ Drone ${drone.modelo} não encontrou rota para pedido ${pedido.id}`);
    await atualizarDroneEBroadcast(drone.id, { status: 'OCIOSO' });
    await atualizarPedidoEBroadcast(pedido.id, 'AGUARDANDO_ALOCACAO');
    return;
  }

  console.log(`🚀 Iniciando entrega do pedido ${pedido.id} com drone ${drone.modelo}`);

  await atualizarPedidoEBroadcast(pedido.id, 'CARREGANDO');
  await atualizarDroneEBroadcast(drone.id, { status: 'CARREGANDO' });

  await esperar(2000); // 2s carregando

  // Percorre o caminho célula por célula
  for (const [linha, coluna] of caminho) {
    drone.bateria -= 1; // Simula consumo de bateria

    const droneEmVoo = await atualizarDroneEBroadcast(drone.id, {
        posX: linha,
        posY: coluna,
        bateria: drone.bateria,
        status: 'EM_VOO'
    });
    
    await atualizarPedidoEBroadcast(pedido.id, 'EM_VOO');

    const novoPontoRota = await prisma.rota.create({
        data: { pedidoId: pedido.id, posX: linha, posY: coluna }
    });
    broadcastService.broadcast({ type: 'ROTA_UPDATE', payload: novoPontoRota });


    console.log(`✈️ Drone ${droneEmVoo.modelo} moveu para (${linha}, ${coluna}) | Bateria: ${droneEmVoo.bateria}%`);

    if (drone.bateria <= 20) {
      console.log(`⚠️ Drone ${drone.modelo} com bateria baixa! Retornando à base...`);
      await retornarParaBase(drone);
      await atualizarPedidoEBroadcast(pedido.id, 'AGUARDANDO_ALOCACAO');
      return;
    }

    await esperar(1000); // 1s por célula
  }

  await atualizarPedidoEBroadcast(pedido.id, 'ENTREGANDO');
  await atualizarDroneEBroadcast(drone.id, { status: 'ENTREGANDO' });

  console.log(`📦 Pedido ${pedido.id} sendo entregue...`);
  await esperar(2000);

  await atualizarPedidoEBroadcast(pedido.id, 'ENTREGUE');
  await retornarParaBase(drone, true); // Retorna à base e recarrega se necessário
  
  console.log(`✅ Pedido ${pedido.id} entregue com sucesso!`);
}

async function retornarParaBase(drone, aposEntrega = false) {
    if (aposEntrega) {
        await atualizarDroneEBroadcast(drone.id, { posX: 0, posY: 0, status: 'OCIOSO' });
        console.log(`🏠 Drone ${drone.modelo} retornou à base.`);
        return;
    }
  
    await atualizarDroneEBroadcast(drone.id, { posX: 0, posY: 0, status: 'RECARREGANDO' });
    
    console.log(`🔋 Drone ${drone.modelo} recarregando...`);
    await esperar(5000); // 5s para recarregar
    
    await atualizarDroneEBroadcast(drone.id, { bateria: 100, status: 'OCIOSO' });

    console.log(`✅ Drone ${drone.modelo} totalmente recarregado!`);
}

module.exports = {
  simularEntrega,
  retornarParaBase
};
