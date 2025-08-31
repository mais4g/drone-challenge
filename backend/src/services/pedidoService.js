const pedidoRepository = require('../repositories/pedidoRepository');
const { alocarPedidos } = require('./alocacaoService'); // ✅ importar alocação

/**
 * Cria um novo pedido e dispara a alocação automática.
 * @param {object} pedidoData - Dados do pedido { pesoKg, localizacao, prioridade }.
 * @returns {object} Pedido criado.
 */
async function criar(pedidoData) {
  // 1. Validação de regras de negócio
  if (!pedidoData.pesoKg || pedidoData.pesoKg <= 0 || pedidoData.pesoKg > 12) {
    throw new Error('Peso do pacote é inválido ou excede a capacidade máxima.');
  }

  // 2. Monta objeto do pedido
  const novoPedido = {
    pesoKg: pedidoData.pesoKg,
    localizacao: pedidoData.localizacao,
    prioridade: pedidoData.prioridade,
    status: 'AGUARDANDO_ALOCACAO'
  };

  // 3. Persiste no banco
  const pedidoCriado = await pedidoRepository.criar(novoPedido);

  // 4. Dispara a alocação automática
  await alocarPedidos();

  return pedidoCriado;
}

/**
 * Lista todos os pedidos.
 */
async function listarTodos() {
  return await pedidoRepository.obterTodos();
}

/**
 * Busca um pedido pelo ID.
 */
async function buscarPorId(id) {
  const pedido = await pedidoRepository.obterPorId(id);
  if (!pedido) throw new Error('Pedido não encontrado');
  return pedido;
}

/**
 * Atualiza o status de um pedido.
 */
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