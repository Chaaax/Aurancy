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

/*************************Obejeticos e poupanças**************** */
  if (analisesAtivas.includes("objetivo")) {
    const mesesRestantes = Math.ceil((valorObjetivo - (poupancaMensal || 0)) / (poupancaMensal || 1));
    resultados.push(`✉️ Estás a poupar ${poupancaMensal}€/mês para atingir ${objetivo} (${valorObjetivo}€). A este ritmo, atinges em ${mesesRestantes} meses.`);
  }

  if (analisesAtivas.includes("poupancaIdeal")) {
    const ideal = savingData.nivelRisco === "Conservador" ? 0.3 : savingData.nivelRisco === "Moderado" ? 0.2 : 0.1;
    resultados.push(`🔢 Com perfil ${savingData.nivelRisco}, o ideal seria poupares ${(ideal*100).toFixed(0)}%. Estás a poupar ${percentagemPoupada}%.`);
  }

  if (analisesAtivas.includes("atingirObjetivo")) {
    const poupancaReal = rendimentoMensal - totalDespesas;
    const falta = valorObjetivo - poupancaReal;
    const meses = Math.ceil(falta / (poupancaMensal || 1));

    const nomeMesAtual = new Date().toLocaleString("pt-PT", { month: "long" });
    resultados.push(`🕰️ No mês de ${nomeMesAtual}, poupaste ${poupancaReal.toFixed(2)}€. A este ritmo, atinges o objetivo de ${valorObjetivo}€ em aproximadamente ${meses} meses.`);
  }

  if (analisesAtivas.includes("poupancaPotencial")) {
  const categoriasReduzir = savingData.categoriasReduzir || [];
  let poupancaExtra = 0;

  categoriasReduzir.forEach(cat => {
    if (categorias[cat]) {
      poupancaExtra += categorias[cat] * 0.3; // Assumimos um corte de 30%
    }
  });

  if (poupancaExtra > 0) {
    resultados.push(`📉 Se reduzires 30% nas categorias que aceitaste reduzir, poderás poupar mais ${poupancaExtra.toFixed(2)}€ por mês.`);
  } else {
    const categoriasReducao = savingData.categoriasReduzir?.join(", ") || "categorias indefinidas";
    resultados.push(`📉 Indicaste que queres reduzir gastos em: ${categoriasReducao}, mas ainda não registaste despesas relevantes nessas categorias este mês.`);
  }

}

if (analisesAtivas.includes("metasFinanceiras")) {
  const poupancaRecomendada = rendimentoMensal * 0.2;
  const poupancaPercentual = (poupancaMensal / rendimentoMensal) * 100;

  if (poupancaPercentual >= 20) {
    resultados.push(`🎯 Excelente! Estás a poupar ${poupancaMensal}€ (${poupancaPercentual.toFixed(1)}%) — acima da meta recomendada de 20%! Continua assim, és uma inspiração financeira! 💪`);
  } else {
    const falta = poupancaRecomendada - poupancaMensal;
    resultados.push(`🧐 A meta comum é poupar 20% do rendimento (${poupancaRecomendada.toFixed(2)}€), mas estás a poupar ${poupancaMensal}€ (${poupancaPercentual.toFixed(1)}%). Bora lá cortar uns cafés ou nos finos depois do trabalho? 😅`);
  }
}
/*****************************Despesas e comportamentos***************** */

if (analisesAtivas.includes("gastosAltos")) {
  const limiteCategoria = rendimentoMensal * 0.3;
  const categoriasAcima = Object.entries(categorias)
    .filter(([_, valor]) => valor > limiteCategoria);

  if (categoriasAcima.length > 0) {
    categoriasAcima.forEach(([cat, val]) => {
      resultados.push(`🚨 Gastaste ${val.toFixed(2)}€ em "${cat}", que ultrapassa o limite recomendado de 30% do teu rendimento (${limiteCategoria.toFixed(2)}€).`);
    });
  } else {
    resultados.push("✅ Nenhuma categoria ultrapassou 30% do teu rendimento. Boa gestão! 👏");
  }
}

if (analisesAtivas.includes("reduziveis")) {
  const gastosReduziveis = reduziveis
    .filter((cat) => categorias[cat])
    .map((cat) => `${cat} (${categorias[cat].toFixed(2)}€)`);

  if (gastosReduziveis.length > 0) {
    resultados.push(`😅 Disseste que querias cortar em: ${gastosReduziveis.join(", ")}, mas parece que o cartão não recebeu o memo...`);
  } else {
    resultados.push(`🧘‍♂️ Prometeste cortar em ${reduziveis.join(", ")}, e até agora estás zen – sem excessos nessas áreas. Nice!`);
  }
}

if (analisesAtivas.includes("gastosSupérfluos")) {
  const maiores = (savingData.maioresGastos || []).map((c) => c.toLowerCase());

  const categoriasEssenciais = [
    "supermercado",
    "habitação",
    "renda",
    "transporte",
    "combustível",
    "educação",
    "serviços públicos",
    "alimentação"
  ];

  const suspeitos = [];

  for (const [cat, valor] of Object.entries(categorias)) {
    const nome = cat.toLowerCase();

    const naoPrioritaria = !maiores.includes(nome);
    const naoEssencial = !categoriasEssenciais.includes(nome);
    const valorBaixo = valor < rendimentoMensal * 0.15;

    if (naoPrioritaria && naoEssencial && valorBaixo) {
      suspeitos.push(`${cat} (${valor.toFixed(2)}€)`);
    }
  }

  if (suspeitos.length > 0) {
    resultados.push(
      `💸 Detetámos gastos em categorias não prioritárias nem essenciais: ${suspeitos.join(", ")}. Talvez possas cortar aí sem grande impacto. 😉`
    );
  } else {
    resultados.push(`🔍 Não foram identificados gastos supérfluos relevantes este mês. Bom controlo!`);
  }
}

if (analisesAtivas.includes("desviosPlano")) {
  const limitePlaneado = rendimentoMensal - poupancaMensal;
  const diferenca = totalDespesas - limitePlaneado;

  if (diferenca > 0) {
    resultados.push(`🚨 Estás a gastar ${diferenca.toFixed(2)}€ acima do teu plano mensal (devias gastar no máximo ${limitePlaneado.toFixed(2)}€). Atenção!`);
  } else {
    resultados.push(`✅ Estás dentro do teu plano de gastos este mês. Excelente disciplina financeira!`);
  }
}



  if (analisesAtivas.includes("evolucao")) {
    resultados.push(`📈 As tuas despesas acumuladas até agora são de ${totalDespesas}€.`);
  }


if (analisesAtivas.includes("alertaExcesso")) {
  const categoriasEssenciais = [
    "renda",  "supermercado", "água", "luz", "eletricidade", "gás", "transportes", "passe", "combustível"
  ];

  const gastosExcesso = Object.entries(categorias).filter(([cat, val]) => {
    const catLower = cat.toLowerCase();
    const isEssencial = categoriasEssenciais.some((essencial) =>
      catLower.includes(essencial)
    );
    return !isEssencial && val > 200;
  });

  if (gastosExcesso.length === 0) {
    resultados.push("✅ Nenhum gasto excessivo em categorias não essenciais. Bom controlo este mês!");
  } else {
    for (const [cat, val] of gastosExcesso) {
      const catLower = cat.toLowerCase();
      let comentarioExtra = "";

      if (catLower.includes("restaurante")) {
        comentarioExtra = "🍝 És cliente VIP dos restaurantes este mês?";
      } else if (catLower.includes("roupa")) {
        comentarioExtra = "🧥 Estás a construir um guarda-roupa para o inverno nuclear?";
      } else if (catLower.includes("tecnologia")) {
        comentarioExtra = "📱 Compraste o novo telemóvel quântico, foi?";
      } else if (catLower.includes("lazer") || catLower.includes("jogos")) {
        comentarioExtra = "🎮 Parece que a diversão não tem preço... mas teve!";
      } else if (catLower.includes("viagens")) {
        comentarioExtra = "✈️ A tua conta bancária também viajou?";
      } else {
        comentarioExtra = "😅 Passaste dos limites nesta categoria!";
      }

      resultados.push(`🚨 Gastaste ${val.toFixed(2)}€ em ${cat}. ${comentarioExtra}`);
    }
  }
}

/***************** Estatísticas e Tendências*************** */

  if (analisesAtivas.includes("categoriasMais")) {
    const top = Object.entries(categorias)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, val]) => `${cat} (${val}€)`)
      .join(", ");
    resultados.push(`🌟 Top categorias: ${top}`);
  }

if (analisesAtivas.includes("variacaoMensal")) {
  const picosPorCategoria = {};

  despesasMes.forEach(d => {
    if (!picosPorCategoria[d.categoria]) {
      picosPorCategoria[d.categoria] = {};
    }
    const dia = new Date(d.data).getDate();
    picosPorCategoria[d.categoria][dia] = (picosPorCategoria[d.categoria][dia] || 0) + d.valor;
  });

  const frasesPico = [];

  Object.entries(picosPorCategoria).forEach(([categoria, dias]) => {
    const total = Object.values(dias).reduce((a, b) => a + b, 0);
    const maiorDia = Math.max(...Object.values(dias));
    const percentagem = ((maiorDia / total) * 100).toFixed(0);

    if (percentagem >= 60 && total > 50) {
      frasesPico.push(`"${categoria}" (${percentagem}%)`);
    }
  });

  if (analisesAtivas.includes("percentagemPoupada")) {
    resultados.push(`⭐️ Estás a poupar ${percentagemPoupada}% do teu rendimento.`);
  }


  if (frasesPico.length > 0) {
    const top3 = frasesPico.slice(0, 3).join(", ");
    resultados.push(`⚡ Picos de despesa num só dia detetados em: ${top3}.`);
  }
}

  if (analisesAtivas.includes("progressoMes")) {
    resultados.push(`⌛ Este mês já gastaste ${totalDespesas}€ de ${rendimentoMensal}€ (${((totalDespesas/rendimentoMensal)*100).toFixed(1)}%).`);
  }

/****************************Inteligência Financeira************************* */

  if (analisesAtivas.includes("recomendacoesIA")) {
    resultados.push("🤖 Sugestão: Estás a gastar muito em subscrições? Considera cancelar alguma que não uses.");
  }

  if (analisesAtivas.includes("projecao")) {
    const mediaDiaria = totalDespesas / (new Date().getDate());
    const projecao = mediaDiaria * diasDoMes;
    resultados.push(`🔮 Mantendo o ritmo atual, vais gastar cerca de ${projecao.toFixed(2)}€ este mês.`);
  }

  if (analisesAtivas.includes("categoriaRisco")) {
    for (const [cat, val] of Object.entries(categorias)) {
      if (val / totalDespesas > 0.5) {
        resultados.push(`💥 ${cat} representa mais de 50% das tuas despesas.`);
      }
    }
  }

    if (analisesAtivas.includes("analiseCompleta")) {
    resultados.push(`🧠 Análise geral: ${percentagemPoupada}% poupado, ${totalDespesas}€ gastos, objetivo: ${objetivo}.`);
  }



  return resultados;
}
