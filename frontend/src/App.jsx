import React, { useState, useEffect } from "react";
import api from "./api";
import FormPedido from "./components/formPedido";
import DroneList from "./components/droneList";
import PedidoList from "./components/pedidoList";
import GridSimulacao from "./components/gridSimulacao";
import "./App.css";

function App() {
  const [drones, setDrones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [rotas, setRotas] = useState({});
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [dronesRes, pedidosRes] = await Promise.all([
          api.get("/drones"),
          api.get("/pedidos"),
        ]);
        setDrones(dronesRes.data);
        setPedidos(pedidosRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:3000/api/updates");

    ws.onopen = () => console.log("✅ Conectado ao servidor WebSocket!");
    ws.onclose = () => console.log("🔌 Desconectado do servidor WebSocket.");
    ws.onerror = (error) => console.error("Erro no WebSocket:", error);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "DRONE_UPDATE":
          setDrones((prev) =>
            prev.map((d) => (d.id === message.payload.id ? message.payload : d))
          );
          break;
        case "PEDIDO_UPDATE":
          setPedidos((prev) =>
            prev.map((p) => (p.id === message.payload.id ? message.payload : p))
          );
          break;
        case "NOVO_PEDIDO":
          setPedidos((prev) => [...prev, message.payload]);
          break;
        case "ROTA_UPDATE":
          setRotas((prev) => ({
            ...prev,
            [message.payload.pedidoId]: [
              ...(prev[message.payload.pedidoId] || []),
              message.payload,
            ],
          }));
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>🚁 Simulador de Entrega com Drones</h1>
      </header>
      <main className="main-content">
        <div className="control-panel">
          <FormPedido />
          <DroneList drones={drones} />
          <PedidoList pedidos={pedidos} onSelectPedido={setPedidoSelecionado} />
        </div>
        <div className="simulation-panel">
          {pedidoSelecionado && (
            <GridSimulacao
              pedidoSelecionadoId={pedidoSelecionado}
              rotas={rotas}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;