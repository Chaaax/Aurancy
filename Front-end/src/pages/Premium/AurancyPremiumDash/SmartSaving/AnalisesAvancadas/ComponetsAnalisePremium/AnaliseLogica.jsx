// src/components/Analises/AnaliseLogica.jsx

// Esta função recebe os dados do utilizador e retorna os resultados das análises selecionadas
export function gerarAnalisesSelecionadas({ 
  savingData,
  despesasMes,
  analisesAtivas,
  mes,
  ano 
}) {
  const resultados = [];

  const totalDespesas = despesasMes.reduce((acc, d) => acc + d.valor, 0);
  const diasDoMes = new Date(ano, mes, 0).getDate();
  const poupancaMensal = savingData.poupancaMensal;
  const rendimentoMensal = savingData.rendimentoMensal;
  const objetivo = savingData.objetivoPoupanca;
  const valorObjetivo = savingData.valorObjetivo;
  const maiorGasto = savingData.maioresGastos || [];
  const reduziveis = savingData.categoriasReduzir || [];

  const percentagemPoupada = ((poupancaMensal / rendimentoMensal) * 100).toFixed(1);

  const categorias = {};
  despesasMes.forEach(d => {
    if (!categorias[d.categoria]) categorias[d.categoria] = 0;
    categorias[d.categoria] += d.valor;
  });

  if (analisesAtivas.includes("objetivo")) {
    const mesesRestantes = Math.ceil((valorObjetivo - (poupancaMensal || 0)) / (poupancaMensal || 1));
    resultados.push(`✉️ Estás a poupar ${poupancaMensal}€/mês para atingir ${objetivo} (${valorObjetivo}€). A este ritmo, atinges em ${mesesRestantes} meses.`);
  }

  if (analisesAtivas.includes("percentagemPoupada")) {
    resultados.push(`⭐️ Estás a poupar ${percentagemPoupada}% do teu rendimento.`);
  }

  if (analisesAtivas.includes("gastosAltos")) {
    for (const [cat, val] of Object.entries(categorias)) {
      if (val > rendimentoMensal * 0.5) {
        resultados.push(`⚠️ Gastaste ${val}€ em ${cat}, mais de 50% do teu rendimento.`);
      }
    }
  }

  if (analisesAtivas.includes("categoriasMais")) {
    const top = Object.entries(categorias)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, val]) => `${cat} (${val}€)`)
      .join(", ");
    resultados.push(`🌟 Top categorias: ${top}`);
  }

  if (analisesAtivas.includes("reduziveis")) {
    reduziveis.forEach(cat => {
      if (categorias[cat]) {
        resultados.push(`❌ Estás a gastar ${categorias[cat]}€ em ${cat}, mas disseste que querias reduzir.`);
      }
    });
  }

  if (analisesAtivas.includes("progressoMes")) {
    resultados.push(`⌛ Este mês já gastaste ${totalDespesas}€ de ${rendimentoMensal}€ (${((totalDespesas/rendimentoMensal)*100).toFixed(1)}%).`);
  }

  if (analisesAtivas.includes("poupancaIdeal")) {
    const ideal = savingData.nivelRisco === "Conservador" ? 0.3 : savingData.nivelRisco === "Moderado" ? 0.2 : 0.1;
    resultados.push(`🔢 Com perfil ${savingData.nivelRisco}, o ideal seria poupares ${(ideal*100).toFixed(0)}%. Estás a poupar ${percentagemPoupada}%.`);
  }

  if (analisesAtivas.includes("atingirObjetivo")) {
    const falta = valorObjetivo - poupancaMensal;
    const meses = Math.ceil(falta / (poupancaMensal || 1));
    resultados.push(`🕰️ Vais atingir o objetivo de ${valorObjetivo}€ em ${meses} meses ao ritmo atual.`);
  }

  if (analisesAtivas.includes("metasFinanceiras")) {
    const poupancaRecomendada = rendimentoMensal * 0.2;
    resultados.push(`📌 Uma meta comum é poupar 20% do rendimento. Isso seria ${poupancaRecomendada.toFixed(2)}€. A tua poupança é ${poupancaMensal}€.`);
  }

  if (analisesAtivas.includes("evolucao")) {
    resultados.push(`📈 As tuas despesas acumuladas até agora são de ${totalDespesas}€.`);
  }

  if (analisesAtivas.includes("gastosSupérfluos")) {
    maiorGasto.forEach(cat => {
      if (categorias[cat] && categorias[cat] < 100) {
        resultados.push(`🧃 Considera reduzir ${cat} (${categorias[cat]}€) para aumentar a tua poupança.`);
      }
    });
  }

  if (analisesAtivas.includes("variacaoMensal")) {
    resultados.push("📊 Em breve: comparação com o mês anterior em cada categoria.");
  }

  if (analisesAtivas.includes("comparacaoMeses")) {
    resultados.push("📊 Em breve: análise da evolução de gastos em meses anteriores.");
  }

  if (analisesAtivas.includes("recomendacoesIA")) {
    resultados.push("🤖 Sugestão: Estás a gastar muito em subscrições? Considera cancelar alguma que não uses.");
  }

  if (analisesAtivas.includes("alertaExcesso")) {
    for (const [cat, val] of Object.entries(categorias)) {
      if (val > 200) {
        resultados.push(`🚨 ${cat} ultrapassou os 200€ este mês!`);
      }
    }
  }

  if (analisesAtivas.includes("categoriaRisco")) {
    for (const [cat, val] of Object.entries(categorias)) {
      if (val / totalDespesas > 0.5) {
        resultados.push(`💥 ${cat} representa mais de 50% das tuas despesas.`);
      }
    }
  }

  if (analisesAtivas.includes("projecao")) {
    const mediaDiaria = totalDespesas / (new Date().getDate());
    const projecao = mediaDiaria * diasDoMes;
    resultados.push(`🔮 Mantendo o ritmo atual, vais gastar cerca de ${projecao.toFixed(2)}€ este mês.`);
  }

  if (analisesAtivas.includes("analiseCompleta")) {
    resultados.push(`🧠 Análise geral: ${percentagemPoupada}% poupado, ${totalDespesas}€ gastos, objetivo: ${objetivo}.`);
  }

  return resultados;
}
