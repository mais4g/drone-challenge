import React, { useState } from "react";
import api from "../api";

export default function FormPedido() {
  const [linha, setLinha] = useState("");
  const [coluna, setColuna] = useState("");
  const [peso, setPeso] = useState("");
  const [prioridade, setPrioridade] = useState("MEDIA");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (linha === "" || coluna === "" || peso === "") {
      alert("Por favor, preencha linha, coluna e peso.");
      return;
    }
    try {
      await api.post("/pedidos", {
        pesoKg: parseFloat(peso),
        localizacao: { linha: parseInt(linha), coluna: parseInt(coluna) },
        prioridade,
      });
      setLinha("");
      setColuna("");
      setPeso("");
      setPrioridade("MEDIA");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
  };

  return (
    <div className="card">
      <h2>Novo Pedido</h2>
      <form onSubmit={handleSubmit} className="form-inline">
        <div className="form-group-inline">
          <label htmlFor="linha">Linha</label>
          <input
            type="number"
            id="linha"
            value={linha}
            onChange={(e) => setLinha(e.target.value)}
            min="0"
            max="9"
            placeholder="0-9"
          />
        </div>
        <div className="form-group-inline">
          <label htmlFor="coluna">Coluna</label>
          <input
            type="number"
            id="coluna"
            value={coluna}
            onChange={(e) => setColuna(e.target.value)}
            min="0"
            max="9"
            placeholder="0-9"
          />
        </div>
        <div className="form-group-inline">
          <label htmlFor="peso">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            min="1"
            placeholder="Ex: 5"
          />
        </div>
        <div className="form-group-inline">
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
        <button type="submit">Criar Pedido</button>
      </form>
    </div>
  );
}