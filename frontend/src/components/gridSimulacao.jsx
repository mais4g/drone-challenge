import { useEffect, useState } from "react";
import api from "../api";

const GRID_SIZE = 10; // mesmo tamanho do grid no backend

export default function GridSimulacao({ pedidoId }) {
  const [rota, setRota] = useState([]);

  useEffect(() => {
    if (!pedidoId) return;

    async function fetchRota() {
      try {
        const res = await api.get(`/entregas/rota/${pedidoId}`);
        setRota(res.data);
      } catch (err) {
        console.error("Erro ao buscar rota:", err.message);
      }
    }

    fetchRota();
    const interval = setInterval(fetchRota, 1000); // atualiza a cada 1s
    return () => clearInterval(interval);
  }, [pedidoId]);

  // Última posição do drone
  const ultimaPos = rota.length > 0 ? rota[rota.length - 1] : null;

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
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  width: 30,
                  height: 30,
                  border: "1px solid #ccc",
                  backgroundColor: isDrone ? "red" : "white",
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}