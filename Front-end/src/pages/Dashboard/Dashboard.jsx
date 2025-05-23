import { useState } from 'react'
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Dashboard.css'
import DespesasMensaisChart from './DespesasMensaisChart/DespesasMensaisChart'
import EvolucaoMensalChart from './DespesasMeses-anuais/EvolucaoMensalChart'
import AgendaFinanceira from '../../components/Agenda/AgendaFinanceira' //antigo calendario
import CalendarioFinanceiro from '../../components/Calendario/CalendarioFinanceiro'

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="dashboard-wrapper">
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
          <div className="grafico-item">
            <EvolucaoMensalChart />
          </div>
        </div>
      <CalendarioFinanceiro />
      </main>
    </div>
  )
}
export default Dashboard