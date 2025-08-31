const GRID_SIZE = 10;

export default function GridSimulacao({ pedidoSelecionadoId, rotas }) {
  const rota = rotas[pedidoSelecionadoId] || [];
  const ultimaPos = rota.length > 0 ? rota[rota.length - 1] : null;
  const destino = rota.length > 0 ? rota[rota.length - 1] : null;

  return (
    <div>
      <h2>Simulação da Entrega</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`,
          gap: "2px",
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, i) =>
          Array.from({ length: GRID_SIZE }).map((_, j) => {
            const isDrone =
              ultimaPos && ultimaPos.posX === i && ultimaPos.posY === j;
            const isPercorrido = rota.some((p) => p.posX === i && p.posY === j);
            const isDestino =
              destino && destino.posX === i && destino.posY === j;

            let color = "white";
            if (isPercorrido) color = "lightblue";
            if (isDestino) color = "green";
            if (isDrone) color = "red";

            return (
              <div
                key={`${i}-${j}`}
                style={{
                  width: 30,
                  height: 30,
                  border: "1px solid #ccc",
                  backgroundColor: color,
                }}
              />
            );
          })
        )}
      </div>
      <p>
        🔴 Drone | 🟦 Rota | 🟩 Destino | ⚪ Livre
      </p>
    </div>
  );
}