import { useEffect, useState } from "react";
import api from "../api";

export default function PedidoList({ onSelectPedido }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    }
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Pedidos</h2>
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            Pedido {p.id.slice(0, 6)} - {p.status} - Prioridade: {p.prioridade}
            {" "}
            <button onClick={() => onSelectPedido(p.id)}>Ver rota</button>
          </li>
        ))}
      </ul>
    </div>
  );
}