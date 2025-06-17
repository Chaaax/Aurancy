import { useEffect, useState } from 'react'
import './SubmenuAgenda.css'
import AgendaFinanceira from '../../../../../components/Agenda/AgendaFinanceira'
import FormEventoFinanceiro from './FormregistarAgenda/FormEventoFinanceiro'
import '../submenu-base.css'

export default function SubmenuAgenda({ subsecaoInicial = '' }) {
  const [secaoAtiva, setSecaoAtiva] = useState('')

  useEffect(() => {
    if (subsecaoInicial === 'agendar' || subsecaoInicial === 'consultar') {
      setSecaoAtiva(subsecaoInicial)
    }
  }, [subsecaoInicial])

  const opcoes = [
    { key: 'agendar', label: 'Agendar evento' },
    { key: 'consultar', label: 'Consultar agenda' }
  ]

  return (
    <div className="submenu-container">
      <div className="submenu-column">
        <h2 className="submenu-title">Gestão de Agenda</h2>
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
        {secaoAtiva === 'agendar' && <FormEventoFinanceiro />}
        {secaoAtiva === 'consultar' && <AgendaFinanceira />}
      </div>
    </div>
  )
}
