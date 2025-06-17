import React, { useEffect, useState } from 'react';
import './MostrarDespesas.css';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const MostrarDespesas = () => {
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    const fetchDespesas = async () => {
      try {
        const res = await fetch('/api/despesas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setDespesas(data);
      } catch (err) {
        console.error('Erro ao buscar despesas:', err);
      }
    };

    fetchDespesas();
  }, []);

  return (
    <div className="mostrar-despesas-container">
      <h2 className="titulo">💸 Todas as Despesas</h2>

      {despesas.length === 0 ? (
        <p className="mensagem-vazia">Não tens despesas registadas.</p>
      ) : (
        <div className="lista-despesas">
          {despesas.map((despesa) => (
            <div key={despesa.id} className="cartao-despesa">
              <div className="info-esquerda">
                <p className="nome">
                  {despesa.nome || <span style={{ visibility: 'hidden' }}>sem nome</span>}
                </p>
                <p className="data">
                  {format(new Date(despesa.data), "dd 'de' MMMM yyyy", { locale: pt })}
                </p>
              </div>
              <div className="info-direita">
                <p className="valor">-{Number(despesa.valor).toFixed(2)}€</p>
                <p className="categoria">
                  {despesa.categoria || <span style={{ visibility: 'hidden' }}>sem categoria</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MostrarDespesas;

