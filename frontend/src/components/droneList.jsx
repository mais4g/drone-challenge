import React from "react";

export default function DroneList({ drones }) {
  return (
    <div className="card">
      <h2>Lista de Drones</h2>
      <div className="list-container">
        {drones.length === 0 ? (
          <p className="empty-text">Nenhum drone cadastrado.</p>
        ) : (
          drones.map((drone) => (
            <div key={drone.id} className="list-item">
              <div>
                <strong>🚁 {drone.modelo}</strong>
                <p>Posição: [{drone.posX}, {drone.posY}]</p>
                <p>
                  Pedido atual:{" "}
                  {drone.pedidoAtualId ? `#${drone.pedidoAtualId}` : "Nenhum"}
                </p>
                <p>Bateria: {drone.bateria}%</p>
              </div>
              <span
                className={`status-tag ${
                  drone.status === "OCIOSO" ? "available" : "busy"
                }`}
              >
                {drone.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}