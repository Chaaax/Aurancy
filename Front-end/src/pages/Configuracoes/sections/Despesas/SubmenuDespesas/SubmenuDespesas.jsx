import { useState } from 'react'
import './SubmenuDespesas.css'
import FormDespesas from './FormDespesas/FormDespesas'


export default function SubmenuDespesas() {
  const [secaoAtiva, setSecaoAtiva] = useState('')

  const opcoes = [
    { key: 'registar', label: 'Registar despesas' },
    { key: 'consultar', label: 'Consultar despesas' }
  ]

  return (
    <div className="submenu-container">
      <div className="submenu-column">
        <h2 className="submenu-title">Gestão de despesas</h2>
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
        {secaoAtiva === 'registar' && <FormDespesas />}
        {secaoAtiva === 'consultar' && (
          <p style={{ color: '#e5e7eb' }}>📄 Aqui vamos mostrar a lista de despesas</p>
        )}
      </div>
    </div>
  )
}