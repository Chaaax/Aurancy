import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Registo from './pages/Registo/Registo';
import Perfil from './pages/Perfil/Perfil';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/registo"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Registo />}
      />

      <Route path="/perfil" element={<Perfil />} 
      />
    </Routes>
  );
}

export default App;



/*
// Versão futura: com React Router para várias páginas
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transacoes from './pages/Transacoes'
import NovaTransacao from './pages/NovaTransacao'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transacoes" element={<Transacoes />} />
      <Route path="/nova" element={<NovaTransacao />} />
    </Routes>
  )
}

export default App
*/

