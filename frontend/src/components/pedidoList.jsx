export default function PedidoList({ pedidos, onSelectPedido }) {
  return (
    <div>
      <h2>Pedidos</h2>
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            Pedido {p.id.slice(0, 6)} - <b>{p.status}</b> - Prioridade:{" "}
            {p.prioridade} - Peso: {p.pesoKg}kg
            <button onClick={() => onSelectPedido(p.id)}>Ver rota</button>
          </li>
        ))}
      </ul>
    </div>
  );
}