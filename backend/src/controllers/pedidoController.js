const pedidoService = require('../services/pedidoService');

async function criarPedido(request, reply) {
  try {
    const pedidoData = request.body;
    const novoPedido = await pedidoService.criar(pedidoData);
    return reply.code(201).send(novoPedido);
  } catch (error) {
    return reply.code(400).send({ error: error.message });
  }
}

async function listarPedidos(request, reply) {
  const pedidos = await pedidoService.listarTodos();
  return reply.send(pedidos);
}

async function buscarPedidoPorId(request, reply) {
  try {
    const pedido = await pedidoService.buscarPorId(request.params.id);
    return reply.send(pedido);
  } catch (error) {
    return reply.code(404).send({ error: error.message });
  }
}

async function atualizarStatusPedido(request, reply) {
  try {
    const { id } = request.params;
    const { status } = request.body;
    const pedidoAtualizado = await pedidoService.atualizarStatus(id, status);
    return reply.send(pedidoAtualizado);
  } catch (error) {
    return reply.code(400).send({ error: error.message });
  }
}

module.exports = {
  criarPedido,
  listarPedidos,
  buscarPedidoPorId,
  atualizarStatusPedido
};