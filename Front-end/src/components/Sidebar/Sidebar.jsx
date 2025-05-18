import './Sidebar.css'
import { FaHome, FaExchangeAlt, FaChartBar } from 'react-icons/fa'

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#"><FaHome /> Dashboard</a></li>
          <li><a href="#"><FaExchangeAlt /> Transações</a></li>
          <li><a href="#"><FaChartBar /> Relatórios</a></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar