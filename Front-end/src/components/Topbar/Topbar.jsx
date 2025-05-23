import './Topbar.css'
import { VscListUnordered } from "react-icons/vsc"
import { FiSearch } from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <VscListUnordered className="topbar-icon" onClick={toggleSidebar} />
        <h1>Aundancy</h1>
      </div>
      <div className="topbar-right">
        <FiSearch className="topbar-icon" />
        <FaUserCircle className="topbar-icon" onClick={() => navigate('/configuracoes')} />
      </div>
    </header>
  )
}

export default Topbar
