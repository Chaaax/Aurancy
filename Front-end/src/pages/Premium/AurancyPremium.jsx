import { loadStripe } from '@stripe/stripe-js';
import './AurancyPremium.css';

const stripePromise = loadStripe('pk_test_TUA_CHAVE_PUBLICAVEL'); // substitui com a tua chave Stripe

const AurancyPremium = () => {
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
      <div className="premium-card">
        <h1 className="premium-title">
          <span className="glow">Aurancy Premium</span> 
        </h1>
        <p className="premium-subtitle">Desbloqueia todo o potencial da tua vida financeira</p>

        <ul className="premium-benefits">
          <li>Pagamentos automáticos com Stripe
          </li>
          <li>Acesso antecipado a funcionalidades novas
          </li>
          <li>Exportação de relatórios em PDF/Excel
          </li>
          <li>Apoio prioritário</li>
        </ul>

        <p className="premium-preco">Apenas <strong>4,99 €</strong> (pagamento único)</p>

        <button className="premium-btn" onClick={handlePagamento}>
          Assinar agora
        </button>
      </div>
    </div>
  );
};

export default AurancyPremium;