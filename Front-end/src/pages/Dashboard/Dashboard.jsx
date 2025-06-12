import { useState } from 'react'
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Dashboard.css'
import DespesasMensaisChart from './DespesasMensaisChart/DespesasMensaisChart'
import EvolucaoMensalChart from './DespesasMeses-anuais/EvolucaoMensalChart'

import CalendarioFinanceiro from '../../components/Calendario/CalendarioFinanceiro'
import './responsive-dashboard.css'
import AnaliseInteligente from '../../components/AnaliseInteligente/AnaliseInteligente'
import ParticlesBackground from '../../components/ParticlesBackground' //particulasgalaxia
import AlertasRecorrentes from '../Dashboard/AlertasRecorrentes/AlertasRecorrentes'

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1 // Janeiro = 0, por isso +1
  const anoAtual = hoje.getFullYear()

  return (
    <div className="dashboard-wrapper">
      <ParticlesBackground />
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <main className="dashboard-main">
        <h2 className="dashboard-title">Resumo das Despesas</h2>

        {/* WRAPPER FLEX */}
        <div className="dashboard-graficos">
          <div className="grafico-item">
            <DespesasMensaisChart />
          </div>
          <div className="grafico-item ">
            <EvolucaoMensalChart />
          </div>
          <div className="grafico-item">
            <AnaliseInteligente/>
          </div>
        </div>
      <div className="dashboard-bottom-section">
            <div className="calendario-wrapper">
              <CalendarioFinanceiro />
            </div>
            <div className="alertas-wrapper">
              <AlertasRecorrentes />
            </div>
          </div>
      </main>
    </div>
      
  )
}

export default Dashboard