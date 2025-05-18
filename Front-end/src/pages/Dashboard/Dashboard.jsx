import { useState } from 'react'

// Topbar e Sidebar
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/sidebar'

import './Dashboard.css'


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

      {/* 🔳 Overlay aparece quando a sidebar está aberta */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <main className="dashboard-main">
        <h2>Bem-vindo à Audancy</h2>
        <p>Este será o teu painel principal.</p>
      </main>
    </div>
  )
}



export default Dashboard


