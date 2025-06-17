// src/components/Analises/MenuAnalises.jsx
import { useState } from "react";
import "./MenuAnalises.css";

const categorias = [
  {
    id: "objetivos",
    titulo: "🎯 Objetivos e Poupança",
    opcoes: [
      { id: "objetivo", label: "Progresso do Objetivo de Poupança" },
      { id: "poupancaIdeal", label: "Poupança ideal para o teu perfil" },
      { id: "atingirObjetivo", label: "Tempo estimado para atingir objetivo" },
      { id: "poupancaPotencial", label: "Poupança potencial com cortes sugeridos" },
      { id: "metasFinanceiras", label: "Alinhamento com metas financeiras" },
    ],
  },
  {
    id: "despesas",
    titulo: "💸 Despesas e Comportamento",
    opcoes: [
      { id: "gastosAltos", label: "Gastos acima do recomendado" },
      { id: "reduziveis", label: "Despesas em categorias que aceitaste reduzir" },
      { id: "gastosSupérfluos", label: "Gastos supérfluos identificados" },
      { id: "desviosPlano", label: "Alertas de desvios ao plano" },
      { id: "alertaExcesso", label: "Alertas de excesso em categorias específicas" },
    ],
  },
  {
    id: "estatisticas",
    titulo: "📊 Estatísticas e Tendências",
    opcoes: [
      { id: "categoriasMais", label: "Categorias com mais despesas" },
      { id: "variacaoMensal", label: "Variação mensal de gastos por categoria" },
      { id: "percentagemPoupada", label: "Percentagem poupada vs rendimento" },
      { id: "progressoMes", label: "Progresso da poupança este mês" },
      { id: "categoriaRisco", label: "Risco de desequilíbrio por categoria" },
    ],
  },
  {
    id: "ia",
    titulo: "🧠 Inteligência Financeira",
    opcoes: [
      { id: "recomendacoesIA", label: "Sugestões inteligentes de poupança" },
      { id: "projecao", label: "Projeção de gastos para os próximos meses" },
      { id: "analiseCompleta", label: "Análise financeira completa e consolidada" },
    ],
  },
];

export default function AnalisesMenu({ analisesAtivas, setAnalisesAtivas }) {
  const [estadoSecoes, setEstadoSecoes] = useState(() =>
    categorias.reduce((acc, cat) => {
      acc[cat.id] = false;
      return acc;
    }, {})
  );

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleAnalise = (id) => {
    setAnalisesAtivas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleSecao = (id) => {
    setEstadoSecoes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleMenu = () => {
    const proximoMostrarMenu = !mostrarMenu;

    // Todas as secções devem começar fechadas ao abrir
    const novoEstado = categorias.reduce((acc, cat) => {
      acc[cat.id] = false;
      return acc;
    }, {});

    setEstadoSecoes(novoEstado);
    setMostrarMenu(proximoMostrarMenu);
  };


  return (
    <div className="menu-analises-container">
      <div className="menu-toggle-bar">
        <h3>📌 Seleciona as análises</h3>
        <button className="btn-toggle" onClick={handleToggleMenu}>
          {mostrarMenu ? "🔽 Esconder Menu" : "🔍 Ver Menu"}
        </button>
      </div>

      {mostrarMenu &&
        categorias.map((secao) => (
          <div key={secao.id} className="secao-analises">
            <div className="accordion-header" onClick={() => toggleSecao(secao.id)}>
              <h4 className="secao-titulo">{secao.titulo}</h4>
              <span className="seta">{estadoSecoes[secao.id] ? "▼" : "▲"}</span>
            </div>

            {estadoSecoes[secao.id] && (
              <div className="menu-analises-box">
                {secao.opcoes.map((analise) => (
                  <label key={analise.id} className="analise-checkbox">
                    <input
                      type="checkbox"
                      checked={analisesAtivas.includes(analise.id)}
                      onChange={() => toggleAnalise(analise.id)}
                    />
                    <span className="checkbox-label">{analise.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

