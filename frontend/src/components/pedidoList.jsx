import React from "react";

export default function PedidoList({
  pedidos,
  onSelectPedido,
  onFiltroChange,
  filtroAtual,
  pedidoSelecionado,
}) {
  const filtros = ["TODOS", "EM_ENTREGA", "ENTREGUE", "AGUARDANDO_ALOCACAO"];

  return (
    <div className="card">
      <h2>Pedidos</h2>
      <div className="filtro-pedidos">
        {filtros.map((filtro) => (
          <button
            key={filtro}
            className={`filtro-btn ${
              filtro === filtroAtual ? "active" : ""
            }`}
            onClick={() => onFiltroChange(filtro)}
          >
            {filtro.replace("_", " ").toLowerCase()}
          </button>
        ))}
      </div>
      <ul className="pedido-list">
        {pedidos.length === 0 ? (
          <p className="empty-text">Nenhum pedido encontrado.</p>
        ) : (
          pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className={`pedido-item ${
                pedido.id === pedidoSelecionado ? "selected" : ""
              }`}
            >
              <div>
                <strong>📦 Pedido #{pedido.id.substring(0, 8)}</strong>
              </div>
              <div>
                Destino:{" "}
                {pedido.localizacao
                  ? `[${pedido.localizacao.linha}, ${pedido.localizacao.coluna}]`
                  : "Carregando..."}
              </div>
              <div>Peso: {pedido.pesoKg} kg</div>
              <div>Prioridade: {pedido.prioridade}</div>
              <div
                className={`status-tag status-${pedido.status.toLowerCase()}`}
              >
                {pedido.status}
              </div>
              <button onClick={() => onSelectPedido(pedido.id)}>
                Ver rota
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}