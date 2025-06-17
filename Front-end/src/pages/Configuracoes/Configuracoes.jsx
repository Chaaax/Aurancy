import React, { useEffect, useState } from 'react';
import './Configuracoes.css';
import Perfil from './sections/Perfil/Perfil';
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import SubmenuDespesas from './sections/Despesas/SubmenuDespesas/SubmenuDespesas';
import SubmenuAgenda from './sections/Agenda/SubmenuAgenda/SubmenuAgenda';
import SubmenuVeiculo from './sections/veiculos/SubmenuVeiculos';
import { useSearchParams, useNavigate, Outlet } from 'react-router-dom';
import Privacidade from './sections/Privacidade/Privacidade';

function Configuracoes() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [secaoAtiva, setSecaoAtiva] = useState('perfil');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const secaoInicial = searchParams.get('secao') || 'perfil';
  const subsecaoInicial = searchParams.get('subsecao') || '';

  useEffect(() => {
    setSecaoAtiva(secaoInicial);
  }, [secaoInicial]);

  const handleNavegacao = (secao) => {
    navigate(`/configuracoes?secao=${secao}`);
    setSidebarOpen(false); // fecha sidebar após navegação
  };

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case 'perfil':
        return <Perfil />;
      case 'despesas':
        return <SubmenuDespesas />;
      case 'agenda':
        return <SubmenuAgenda subsecaoInicial={subsecaoInicial} />;
      case 'veiculos':
        return <SubmenuVeiculo />;
      case 'privacidade':
        return <Privacidade />;
      default:
        return <div className="secao-placeholder">Escolhe uma secção</div>;
    }
  };

  return (
    <div className="config-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="configuracoes-layout">
        <aside className="menu-lateral">
          <h2>Gestão pessoal</h2>
          <ul>
            <li onClick={() => handleNavegacao('perfil')} className={secaoAtiva === 'perfil' ? 'ativo' : ''}>Perfil</li>
            <li onClick={() => handleNavegacao('despesas')} className={secaoAtiva === 'despesas' ? 'ativo' : ''}>Despesas</li>
            <li onClick={() => handleNavegacao('agenda')} className={secaoAtiva === 'agenda' ? 'ativo' : ''}>Agenda</li>
            <li onClick={() => handleNavegacao('veiculos')} className={secaoAtiva === 'veiculos' ? 'ativo' : ''}>Veículos</li>
            <li onClick={() => handleNavegacao('privacidade')} className={secaoAtiva === 'privacidade' ? 'ativo' : ''}>Privacidade</li>
          </ul>
        </aside>
        <main className="conteudo-secao">
          {renderConteudo()}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Configuracoes;

