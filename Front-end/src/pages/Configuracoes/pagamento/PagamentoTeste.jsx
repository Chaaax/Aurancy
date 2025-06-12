import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TUA_CHAVE_PUBLICAVEL_AQUI'); // substitui com a tua chave

const PagamentoTeste = () => {
      const handlePagamento = async () => {
        const res = await fetch('/api/payments/create-checkout-session', {
          method: 'POST',
        });

        const data = await res.json();
        
        console.log("Resposta completa do backend:", data);

        console.log("Resposta Stripe:", data); // 👈 Muito importante!


        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Erro: sessão de pagamento não foi criada.");
        }
      };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Aurancy Premium</h1>
      <p>Acede a funcionalidades exclusivas por apenas <strong>4,99 €</strong>.</p>
      <button
        onClick={handlePagamento}
        style={{
          backgroundColor: '#635BFF',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Pagar com Cartão 💳
      </button>
    </div>
  );
};

export default PagamentoTeste;
