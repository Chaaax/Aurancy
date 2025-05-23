// Configuracoes.jsx
import React, { useEffect, useState } from 'react'
import './Configuracoes.css'
import Perfil from './sections/Perfil/Perfil'
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import SubmenuDespesas from './sections/Despesas/SubmenuDespesas/SubmenuDespesas'
import SubmenuAgenda from './sections/Agenda/SubmenuAgenda/SubmenuAgenda'
import { useSearchParams, Outlet } from 'react-router-dom'

function Configuracoes() {
  const [secaoAtiva, setSecaoAtiva] = useState('perfil')
  const [searchParams] = useSearchParams()
  const [params] = useSearchParams();
  const secaoInicial = params.get('secao') || 'perfil';
  const subsecaoInicial = params.get('subsecao') || '';

  useEffect(() => {
    const secao = searchParams.get('secao')
    if (secao) setSecaoAtiva(secao)
  }, [searchParams])

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case 'perfil':
        return <Perfil />
      case 'despesas':
        return <SubmenuDespesas />
      case 'agenda':
        return <SubmenuAgenda />
      case 'veiculos':
        return <div className="secao-placeholder">Gestão de veículos (em breve)</div>
      case 'privacidade':
        return <div className="secao-placeholder">Dados pessoais e privacidade</div>
      default:
        return <div className="secao-placeholder">Escolhe uma secção</div>
    }
  }

  return (
    <>
      <Topbar />
      <div className="config-wrapper">
        <Sidebar />
        <div className="configuracoes-layout">
          <aside className="menu-lateral">
            <h2>Gestão pessoal</h2>
            <ul>
              <li onClick={() => setSecaoAtiva('perfil')} className={secaoAtiva === 'perfil' ? 'ativo' : ''}>Perfil</li>
              <li onClick={() => setSecaoAtiva('despesas')} className={secaoAtiva === 'despesas' ? 'ativo' : ''}>Despesas</li>
              <li onClick={() => setSecaoAtiva('agenda')} className={secaoAtiva === 'agenda' ? 'ativo' : ''}>Agenda</li>
              <li onClick={() => setSecaoAtiva('veiculos')} className={secaoAtiva === 'veiculos' ? 'ativo' : ''}>Veículos</li>
              <li onClick={() => setSecaoAtiva('privacidade')} className={secaoAtiva === 'privacidade' ? 'ativo' : ''}>Privacidade</li>
            </ul>
          </aside>
          <main className="conteudo-secao">
            {renderConteudo()}
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default Configuracoes
