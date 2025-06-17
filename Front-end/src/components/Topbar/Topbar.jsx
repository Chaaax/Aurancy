import './Topbar.css';
import { VscListUnordered } from "react-icons/vsc";
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoAurancy from '../LogosAurancy/aurancy-logo.png';
import { FiSettings } from 'react-icons/fi';
function Topbar({ toggleSidebar }) {
  const { user } = useContext(AuthContext);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <VscListUnordered className="topbar-icon" onClick={toggleSidebar} />
        <img
            src={logoAurancy}
            alt="Logo Aurancy"
            className="topbar-logo"
            onClick={() => navigate('/Dashboard')}
          />
      </div>

        <div className="topbar-right">
  <div className="topbar-user-block">
    <img
      src={user?.profilePicture || '/images/profile-default.png'}
      className="topbar-avatar"
      onClick={() => navigate('/configuracoes?secao=perfil')}
      alt="Perfil"
    />
    <button className="topbar-settings" onClick={() => navigate('/configuracoes')}>
      <FiSettings />
    </button>
  </div>
</div>
    </header>
  );
}

export default Topbar;

