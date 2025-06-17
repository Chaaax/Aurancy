import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Registo from './pages/Registo/Registo';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import SubmenuAgenda from './pages/Configuracoes/sections/Agenda/SubmenuAgenda/SubmenuAgenda'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PremiumRoute from './components/PremiumRoute';
import FormEventoFinanceiro from './pages/Configuracoes/sections/Agenda/SubmenuAgenda/FormregistarAgenda/FormEventoFinanceiro';


//AurancyPremium
import PagamentoAurancyPremium from './pages/Configuracoes/pagamento/PagamentoAurancyPremium';
import AurancyPremium from './pages/Premium/AurancyPremium';
import PagamentoSucesso from './pages/Premium/PagamentoSucesso/PagamentoSucesso';
import DashboardPremium from "./pages/Premium/AurancyPremiumDash/DashboardPremium";






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
        path="/registo"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Registo />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Configuracoes />
          </PrivateRoute>
        }
      />

      
     <Route path="/PagamentoAurancyPremium" element={<PagamentoAurancyPremium />} />

  
     <Route path="/premium" element={<AurancyPremium />} />
     <Route path="/pagamento/sucesso" element={<PagamentoSucesso />} />

       
     <Route
        path="/premium/dashboard"
        element={
          <PremiumRoute>
            <DashboardPremium />
          </PremiumRoute>
        }
      />
  
    <Route path="/configuracoes/FormEventoFinanceiro" element={<FormEventoFinanceiro />} />


      <Route path="agenda" element={<SubmenuAgenda />} />

    </Routes>
  );
}

export default App;