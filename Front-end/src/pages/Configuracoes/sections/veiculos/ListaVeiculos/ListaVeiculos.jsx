import { useEffect, useState } from 'react';
import './ListaVeiculos.css';
import DetalhesVeiculo from './DetalhesVeiculos/DetalhesVeiculos';

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/veiculos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVeiculos(data))
      .catch(err => console.error('Erro ao carregar veículos:', err));
  }, []);

  return (
    <div className="lista-veiculos-container">
      <div className="lista-veiculos">
        <h2>📋 Meus Veículos</h2>
        {veiculos.length === 0 ? (
          <p>Não tens veículos registados.</p>
        ) : (
          veiculos.map(v => (
            <div
              key={v.id}
              className={`card-veiculo ${veiculoSelecionado?.id === v.id ? 'ativo' : ''}`}
              onClick={() => setVeiculoSelecionado(v)}
            >
              <strong>{v.marca} {v.modelo}</strong>
              <span className="topo-extra">Matrícula: {v.matricula} • Ano: {v.ano}</span>
            </div>
          ))
        )}
      </div>

      {/* Detalhes do veículo em componente separado */}
      {veiculoSelecionado && (
       <DetalhesVeiculo
          veiculo={veiculoSelecionado}
          onFechar={() => setVeiculoSelecionado(null)}
          onAtualizar={(veiculoAtualizado) => {
            setVeiculos(prev =>
              prev.map(v => v.id === veiculoAtualizado.id ? veiculoAtualizado : v)
            );
            setVeiculoSelecionado(veiculoAtualizado); // atualiza os detalhes também
          }}
        />
      )}
    </div>
  );
}
