import React, { useState, useEffect, useContext } from "react";
import ParticlesBackground from "../../../components/ParticlesBackground";
import SelecaoServicos from "../AurancyPremiumDash/SelecaoServicos/SelecaoServicos";
import { AuthContext } from "../../../context/AuthContext";
import "./DashboardPremium.css";
import FormularioSaving from "./SmartSaving/FormularioSaving";
import GraficoLinhasPremium from "./SmartSaving/GraficoLinhasPremium/GraficoLinhasPremium";
import AnalisesAvancadas from "./SmartSaving/AnalisesAvancadas/AnalisesAvancadas";

/* ícones */
import amazon from "../../../assets/Servicos/amazonprime.svg";
import spotify from "../../../assets/Servicos/spotify.svg";
import netflix from "../../../assets/Servicos/netflix.svg";
import icloud from "../../../assets/Servicos/icloud.svg";
import youtube from "../../../assets/Servicos/youtube.svg";
import disney from "../../../assets/Servicos/disney.svg";
import applemusic from "../../../assets/Servicos/applemusic.svg";
import appletv from "../../../assets/Servicos/appletv.svg";
import hbomax from "../../../assets/Servicos/hbomax.svg";
import playstation from "../../../assets/Servicos/playstation.svg";

const iconesServicos = {
  "Spotify Premium": spotify,
  "Netflix": netflix,
  "iCloud 200GB": icloud,
  "YouTube Premium": youtube,
  "Disney+": disney,
  "Amazon Prime Video": amazon,
  "Apple Music": applemusic,
  "Apple TV+": appletv,
  "HBO Max": hbomax,
  "PlayStation Plus": playstation,
};

export default function DashboardPremium() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);
  const [subToRemover, setSubToRemover] = useState(null);
  const [erroDuplicado, setErroDuplicado] = useState(null);
  const [formEnviado, setFormEnviado] = useState(false);
  const { user } = useContext(AuthContext);
  /*formulario*/
  const [formularioPreenchido, setFormularioPreenchido] = useState(false);
  const [mostrarFormularioSaving, setMostrarFormularioSaving] = useState(false);

  const [analisesAtivas, setAnalisesAtivas] = useState([]);

  useEffect(() => {
    const carregarPagamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/payments/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPagamentos(data);
      } catch (err) {
        console.error("Erro ao carregar pagamentos:", err);
      }
    };

    carregarPagamentos();
  }, []);

  useEffect(() => {
    document.body.style.overflow = erroDuplicado || subToRemover ? 'hidden' : 'auto';
  }, [erroDuplicado, subToRemover]);

  const adicionarServico = async (servico) => {
    if (!user || !user.id) {
      alert("Utilizador não autenticado.");
      return;
    }

    const nomeExistente = pagamentos.find(p => p.nome === servico.nome);
    if (nomeExistente) {
      setErroDuplicado(servico.nome);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          nome: servico.nome,
          valor: servico.valor,
          dataRenovacao: servico.diaRenovacao,
          categoria: "subscricao",
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Erro ao adicionar: ${msg}`);
      }

      const novo = await res.json();
      setPagamentos((prev) => [...prev, novo]);
      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      alert("Erro ao adicionar. Ver consola para detalhes.");
    }
  };

  const abrirConfirmacao = (pagamento) => {
    setSubToRemover(pagamento);
  };

  const removerPagamento = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/payments/${id}`, { method: "DELETE" });
      setPagamentos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  };

  const iniciarPagamento = async (pagamento) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: pagamento.nome,
          valor: pagamento.valor,
          descricao: `Pagamento de ${pagamento.nome}`,
          pagamentoId: pagamento.id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao criar sessão de pagamento.");
      }
    } catch (err) {
      console.error("Erro ao iniciar pagamento:", err);
      alert("Erro ao iniciar pagamento.");
    }
  };

  return (
    <div className="dashboard-premium-wrapper">
      <ParticlesBackground />
      <div className="dashboard-premium-container">
        <div className="premium-header">
          <h1>Bem-vindo ao Aurancy Premium ✨</h1>
          <p>Gestão avançada da tua vida financeira com tecnologia inteligente.</p>
        </div>

        <div className="premium-columns">
          <section className="premium-section">
            <h2>📅 Pagamentos Recorrentes</h2>
            <p className="section-subtitle">
              Visualiza e controla os teus pagamentos automáticos mensais.
            </p>
            <div className="recurring-list">
              {pagamentos.map((p) => {
                const pagoEsteMes = p.ultimoPagamento &&
                  new Date(p.ultimoPagamento).getMonth() === new Date().getMonth() &&
                  new Date(p.ultimoPagamento).getFullYear() === new Date().getFullYear();

                return (
                  <div key={p.id} className="recurring-item">
                    <button onClick={() => abrirConfirmacao(p)} className="delete-top-btn">✖</button>
                    <div className="service-info">
                      {iconesServicos[p.nome] && (
                        <img src={iconesServicos[p.nome]} alt={p.nome} className="service-icon" />
                      )}
                      <div className="service-text">
                        <span className="service-name">{p.nome}</span>
                        <span className="service-amount">{p.valor.toFixed(2)} € / mês</span>
                        <span className="service-date">
                          {(() => {
                            if (!p.ultimoPagamento) return "Nunca foi pago";

                            const hoje = new Date();
                            const ultimoPagamento = new Date(p.ultimoPagamento);
                            const proximaRenovacao = new Date(ultimoPagamento);
                            proximaRenovacao.setMonth(proximaRenovacao.getMonth() + 1);

                            const diffMs = proximaRenovacao - hoje;
                            const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                            if (diffDias < 0) return "Renovação em atraso";
                            if (diffDias === 0) return "Renova hoje";
                            if (diffDias === 1) return "Renova amanhã";
                            return `Renova em ${diffDias} dias`;
                          })()}
                        </span>
                        {pagoEsteMes ? (
                          <span className="status-pago">✅ Pago este mês</span>
                        ) : (
                          <button className="pay-btn" onClick={() => iniciarPagamento(p)}>
                            💳 Pagar Agora
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="adicionar-btn" onClick={() => setMostrarModal(true)}>
                ➕ Adicionar Subscrição
              </button>
            </div>
          </section>

            <section className="premium-section">
              <h2>💰 Assistente de Poupança</h2>
              <p className="section-subtitle">
                Responde ao questionário para receber sugestões personalizadas de poupança e investimento.
              </p>

              {mostrarFormularioSaving ? (
                <div className="formulario-wrapper-completo">
                  <div className="formulario-header-bar">
                    <button
                      className="btn-esconder-formulario"
                      onClick={() => setMostrarFormularioSaving(false)}
                    >
                      🔽 Esconder Formulário
                    </button>
                  </div>
                  <FormularioSaving />
                </div>
              ) : (
                <div className="formulario-colapsado-card">
                  <h3>💡 Assistente de Poupança</h3>
                  <p>Já preenches-te o formulário ou decidiste escondê-lo.</p>
                  <button
                    className="btn-mostrar-formulario"
                    onClick={() => setMostrarFormularioSaving(true)}
                  >
                    🔍 Ver Formulário
                  </button>
                </div>
              )}
        <GraficoLinhasPremium />
      </section>


          <section className="premium-section">
            <AnalisesAvancadas />
          </section>
        </div>
      </div>

      {mostrarModal && (
        <SelecaoServicos
          onAdicionar={adicionarServico}
          onFechar={() => setMostrarModal(false)}
        />
      )}

      {subToRemover && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Remover Subscrição</h3>
            <p>Queres mesmo remover <strong>{subToRemover.nome}</strong>?</p>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setSubToRemover(null)}>Cancelar</button>
              <button className="btn-remover" onClick={() => {
                removerPagamento(subToRemover.id);
                setSubToRemover(null);
              }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {erroDuplicado && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Subscrição Existente</h3>
            <p>Já tens <strong>{erroDuplicado}</strong> ativa na tua conta.</p>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setErroDuplicado(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}










