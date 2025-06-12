import { useState } from 'react';
import './SubmenuVeiculos.css';
import FormularioVeiculo from './FormularioVeiculo/FormularioVeiculo';
import ListaVeiculos from './ListaVeiculos/ListaVeiculos.jsx';

export default function SubmenuVeiculo() {
  const [secaoAtiva, setSecaoAtiva] = useState('');

  const opcoes = [
    { key: 'adicionar', label: 'Adicionar Veículo' },
    { key: 'consultar', label: 'Consultar Veículos' }
  ];

  return (
    <div className="submenu-container">
      <div className="submenu-column">
        <h2 className="submenu-title">Gestão de Veículos</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {opcoes.map(opcao => (
            <li key={opcao.key}>
              <button
                onClick={() => setSecaoAtiva(opcao.key)}
                className={`submenu-button ${secaoAtiva === opcao.key ? 'active' : ''}`}
              >
                {opcao.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="submenu-content">
        {secaoAtiva === 'adicionar' && (
          <div>
            <FormularioVeiculo />
          </div>
        )}
        {secaoAtiva === 'consultar' && (
          <ListaVeiculos />
        )}
      </div>
    </div>
  );
}
