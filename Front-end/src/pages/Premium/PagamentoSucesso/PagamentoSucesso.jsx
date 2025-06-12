import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PagamentoSucesso.css';

const PagamentoSucesso = () => {
  const [params] = useSearchParams();
  const [mensagem, setMensagem] = useState('A processar pagamento...');

  useEffect(() => {
    const pid = params.get('pid');
    const token = localStorage.getItem('token');

    const ativarPremium = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/ativar-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();
        setMensagem('Pagamento confirmado! Aurancy Premium ativado ✨');
      } catch {
        setMensagem('Erro ao ativar o Premium. Contacta suporte.');
      }
    };

    const confirmarPagamentoRecorrente = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/payments/confirmar/${pid}`, {
          method: 'PUT',
        });

        if (!res.ok) throw new Error();
        setMensagem('Pagamento registado com sucesso! ✅');
      } catch {
        setMensagem('Erro ao confirmar o pagamento. Contacta suporte.');
      }
    };

    // 🔀 Decidir qual tipo de pagamento foi feito
    if (pid === 'premium') {
      ativarPremium();
    } else if (pid) {
      confirmarPagamentoRecorrente();
    } else {
      setMensagem('Pagamento processado, mas sem referência conhecida.');
    }
  }, [params]);

  return (
    <div className="sucesso-wrapper">
      <div className="sucesso-card">
        <h1 className="sucesso-title">✅ Obrigado pelo teu apoio!</h1>
        <p className="sucesso-text glow-text">{mensagem}</p>
      </div>
    </div>
  );
};

export default PagamentoSucesso;

