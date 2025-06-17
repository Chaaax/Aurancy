import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PagamentoSucesso.css';

const PagamentoSucesso = () => {
  const [params] = useSearchParams();
  const [mensagem, setMensagem] = useState('A processar pagamento...');
  const navigate = useNavigate();

  useEffect(() => {
    const pid = params.get('pid');
    const token = localStorage.getItem('token');

    console.log('PID recebido:', pid);
    console.log('Token JWT:', token);

    const ativarPremium = async () => {
      try {
        console.log('🔁 A enviar pedido para ativar premium...');

        const res = await fetch('http://localhost:3000/api/auth/ativar-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Erro na resposta do backend:', errorText);
          throw new Error();
        }

        console.log('✅ Premium ativado com sucesso!');
        setMensagem('Pagamento confirmado! Aurancy Premium ativado ✨');
      } catch (err) {
        console.error('❌ Erro ao ativar premium:', err);
        setMensagem('Erro ao ativar o Premium. Contacta suporte.');
      }
    };

    const confirmarPagamentoRecorrente = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/payments/confirmar/${pid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Erro ao confirmar pagamento recorrente:', errorText);
          throw new Error();
        }

        console.log('✅ Pagamento recorrente confirmado!');
        setMensagem('Pagamento registado com sucesso! ✅');
      } catch (err) {
        console.error('❌ Erro ao confirmar pagamento:', err);
        setMensagem('Erro ao confirmar o pagamento. Contacta suporte.');
      }
    };

    // 🔀 Decidir qual tipo de pagamento foi feito
    if (pid === 'premium') {
      ativarPremium();
    } else if (pid) {
      confirmarPagamentoRecorrente();
    } else {
      console.warn('⚠️ Nenhum PID recebido na query.');
      setMensagem('Pagamento processado, mas sem referência conhecida.');
    }
  }, [params]);

  return (
    <div className="sucesso-wrapper">
      <div className="sucesso-card">
        <h1 className="sucesso-title">✅ Obrigado pelo teu apoio!</h1>
        <p className="sucesso-text glow-text">{mensagem}</p>

        <button
          className="btn-ir-premium"
          onClick={() => navigate('/premium/dashboard')}
        >
          Aceder ao Aurancy Premium 🚀
        </button>
      </div>
    </div>
  );
};

export default PagamentoSucesso;


