import React from "react";
import cidade from "../../../backend/src/data/cidade.js";

export default function GridSimulacao({ 
  drones, 
  pedidoSelecionadoId, 
  rotas, 
  pedidos 
}) {
  const GRID_SIZE = 10;
  const rota = rotas[pedidoSelecionadoId] || [];
  const destino = rota.length > 0 ? rota[rota.length - 1] : null;

  const pedidoSelecionado = pedidos.find((p) => p.id === pedidoSelecionadoId);
  const isRotaHistorica = pedidoSelecionado?.status === "ENTREGUE";

  const droneDaEntrega = drones.find(
    (d) => d.pedidoAtualId === pedidoSelecionadoId
  );

  return (
    <div className="card">
      <div className="simulacao-header">
        <h2>
          {isRotaHistorica ? "Rota Histórica" : "Simulação da Entrega"}
        </h2>
        {pedidoSelecionado && (
          <span className={`status-indicator status-${pedidoSelecionado.status.toLowerCase()}`}>
            {pedidoSelecionado.status}
          </span>
        )}
      </div>
      
      <div className="grid-simulacao">
        {Array.from({ length: GRID_SIZE }).map((_, linha) =>
          Array.from({ length: GRID_SIZE }).map((_, coluna) => {
            const isDrone =
              !isRotaHistorica &&
              droneDaEntrega &&
              droneDaEntrega.posX === linha &&
              droneDaEntrega.posY === coluna;

            const isRota = rota.some(
              (p) => p.linha === linha && p.coluna === coluna
            );
            const isDestino =
              destino &&
              destino.linha === linha &&
              destino.coluna === coluna;

            const isObstaculo = cidade[linha][coluna] === 1;

            let cellClass = "grid-cell vazio";
            if (isObstaculo) cellClass = "grid-cell obstaculo";
            if (isRota) cellClass = `grid-cell ${isRotaHistorica ? "rota-historica" : "rota"}`;
            if (isDestino) cellClass = "grid-cell destino";
            if (isDrone) cellClass = "grid-cell drone";

            return <div key={`${linha}-${coluna}`} className={cellClass} />;
          })
        )}
      </div>
      
      <div className="legenda">
        <span>🔴 Drone</span>
        <span>🟦 Rota {isRotaHistorica ? "Histórica" : "Atual"}</span>
        <span>🟩 Destino</span>
        <span>⚫ Obstáculo</span>
        <span>⚪ Livre</span>
      </div>
    </div>
  );
}