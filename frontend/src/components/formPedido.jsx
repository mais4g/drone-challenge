import { useState } from "react";
import api from "../api";

export default function FormPedido() {
  const [pesoKg, setPesoKg] = useState("");
  const [linha, setLinha] = useState("");
  const [coluna, setColuna] = useState("");
  const [prioridade, setPrioridade] = useState("MEDIA");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/pedidos", {
        pesoKg: parseFloat(pesoKg),
        localizacao: { linha: parseInt(linha), coluna: parseInt(coluna) },
        prioridade
      });
      alert("Pedido criado com sucesso!");
      setPesoKg("");
      setLinha("");
      setColuna("");
      setPrioridade("MEDIA");
    } catch (err) {
      alert("Erro ao criar pedido: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Pedido</h2>
      <input
        type="number"
        placeholder="Peso (kg)"
        value={pesoKg}
        onChange={(e) => setPesoKg(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Linha"
        value={linha}
        onChange={(e) => setLinha(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Coluna"
        value={coluna}
        onChange={(e) => setColuna(e.target.value)}
        required
      />
      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
        <option value="BAIXA">Baixa</option>
        <option value="MEDIA">Média</option>
        <option value="ALTA">Alta</option>
      </select>
      <button type="submit">Criar Pedido</button>
    </form>
  );
}