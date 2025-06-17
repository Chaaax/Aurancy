import './Sidebar.css';
import {
  FaStar, FaUser, FaListUl, FaCalendarAlt, FaCar, FaLock
} from 'react-icons/fa';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, setIsOpen }) {
  const { user, loading } = useContext(AuthContext);
  const sidebarRef = useRef(null);
  const [dropdownAberto, setDropdownAberto] = useState(false); // ✅ ADICIONADO
  const navigate = useNavigate(); 

  // Detecta clique fora da sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
        setDropdownAberto(false); // fecha dropdown se clicarmos fora
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (loading) return null;

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
    >
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/configuracoes?secao=perfil"><FaUser /> Perfil</Link></li>
          <li><Link to="/configuracoes?secao=despesas"><FaListUl /> Despesas</Link></li>
          <li><Link to="/configuracoes?secao=agenda"><FaCalendarAlt /> Agenda</Link></li>
          <li><Link to="/configuracoes?secao=veiculos"><FaCar /> Veículos</Link></li>
          <li><Link to="/configuracoes?secao=privacidade"><FaLock /> Privacidade</Link></li>
          {user?.premium && (
            <li>
              <Link to="/premium/dashboard">
                <FaStar className="icon-premium" /> Exclusivo Premium
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* 👤 Avatar + dropdown */}
      <div className="sidebar-footer" onClick={() => setDropdownAberto((prev) => !prev)}>
        <img
          src={user?.profilePicture || '/images/profile-default.png'}
          alt="Avatar"
          className="sidebar-avatar"
        />
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user?.fullName}</span>
          <span className="sidebar-user-email">{user?.email}</span>
        </div>

        {dropdownAberto && (
          <div className="sidebar-dropdown">
            <button onClick={() => navigate('/configuracoes?secao=perfil')}>👤 Ver perfil</button>
           <button onClick={() => {
                localStorage.removeItem('token'); 
                navigate('/');                   
              }}>
                🚪 Terminar sessão
              </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;


