import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../../context/AuthContext';
import './AurancyPremium.css';
import ParticlesBackground from '../../components/ParticlesBackground';
import { ArrowLeft } from 'lucide-react'; 

const stripePromise = loadStripe('pk_test_51RWKrWCAlPKqBiu0QlYPFKvvgCnaI4o9QRaYKmcpYaXszSsmzqsn6qwlLOsRBC0oMZp8lJFKSRJtVn6H6qmPl4Hc00xfb0CGRO');

const AurancyPremium = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.premium) {
      navigate('/premium/dashboard');
    }
  }, [user, navigate]);

  const handlePagamento = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Erro: sessão de pagamento não foi criada.');
    }
  };

  return (
    <div className="premium-wrapper">
      <ParticlesBackground />

      <main className="premium-main">
        <div className="voltar-dashboard" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </div>

        <div className="premium-card">
          <button className="voltar-btn" onClick={() => navigate('/dashboard')}>
            ← Voltar
          </button>
          <h1 className="premium-title">
            <span className="glow">Aurancy Premium</span>
          </h1>
          <p className="premium-subtitle">
            Desbloqueia todo o potencial da tua vida financeira
          </p>

          <ul className="premium-benefits">
            <li>✅ Pagamentos automáticos com Stripe</li>
            <li>✅ Acesso antecipado a funcionalidades novas</li>
            <li>✅ Analises detalhadas</li>
            <li>✅ Apoio prioritário</li>
          </ul>

          <p className="premium-preco">
            Apenas <strong>4,99 €</strong> (pagamento único)
          </p>

          <button className="premium-btn" onClick={handlePagamento}>
            Assinar agora
          </button>
        </div>
      </main>
    </div>
  );
};

export default AurancyPremium;
