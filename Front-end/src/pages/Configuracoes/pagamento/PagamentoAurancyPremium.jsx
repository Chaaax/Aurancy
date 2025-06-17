import React from 'react';
import ParticlesBackground from '../../../components/ParticlesBackground';
import './PagamentoAurancyPremium.css';

const PagamentoAurancyPremium = () => {
  const handlePagamento = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
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
    <div className="pagamento-premium-wrapper">
      <ParticlesBackground />

      <div className="pagamento-card">
        <h1 className="premium-title">Aurancy Premium</h1>
        <p className="premium-subtitle">Desbloqueia todo o potencial da tua vida financeira</p>

        <ul className="premium-benefits">
          <li>✅ Pagamentos automáticos com Stripe</li>
          <li>✅ Acesso antecipado a funcionalidades novas</li>
          <li>✅ Exportação de relatórios em PDF/Excel</li>
          <li>✅ Apoio prioritário</li>
        </ul>

        <p className="premium-preco">
          Apenas <strong>4,99 €</strong> <span style={{ fontSize: '0.9rem' }}>(pagamento único)</span>
        </p>

        <button className="premium-btn" onClick={handlePagamento}>
          Assinar agora
        </button>
      </div>
    </div>
  );
};

export default PagamentoAurancyPremium;


