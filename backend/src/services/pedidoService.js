const pedidoRepository = require('../repositories/pedidoRepository');
const { alocarPedidos } = require('./alocacaoService');

/**
 * @param {object} pedidoData - Dados do pedido 
 * @returns {object} Pedido criado.
 */
async function criar(pedidoData) {
  if (!pedidoData.pesoKg || pedidoData.pesoKg <= 0 || pedidoData.pesoKg > 12) {
    throw new Error('Peso do pacote é inválido ou excede a capacidade máxima.');
  }

  const novoPedido = {
    pesoKg: pedidoData.pesoKg,
    localizacao: pedidoData.localizacao,
    prioridade: pedidoData.prioridade,
    status: 'AGUARDANDO_ALOCACAO'
  };

  const pedidoCriado = await pedidoRepository.criar(novoPedido);

  await alocarPedidos();

  return pedidoCriado;
}

async function listarTodos() {
  return await pedidoRepository.obterTodos();
}

async function buscarPorId(id) {
  const pedido = await pedidoRepository.obterPorId(id);
  if (!pedido) throw new Error('Pedido não encontrado');
  return pedido;
}

async function atualizarStatus(id, novoStatus) {
  const pedido = await pedidoRepository.obterPorId(id);
  if (!pedido) throw new Error('Pedido não encontrado');

  return await pedidoRepository.atualizarStatus(id, novoStatus);
}

module.exports = {
  criar,
  listarTodos,
  buscarPorId,
  atualizarStatus
};