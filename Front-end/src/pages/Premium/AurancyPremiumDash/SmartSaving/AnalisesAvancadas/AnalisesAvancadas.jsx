import React, { useEffect, useState } from "react";
import MenuAnalises from "./ComponetsAnalisePremium/MenuAnalises";
import { gerarAnalisesSelecionadas } from "./ComponetsAnalisePremium/AnaliseLogica";

export default function AnalisesAvancadas() {
  const [formData, setFormData] = useState(null);
  const [despesasMes, setDespesasMes] = useState([]);
  const [analisesAtivas, setAnalisesAtivas] = useState([]);
  const [erro, setErro] = useState("");

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem("token");

        const [resForm, resDespesas] = await Promise.all([
          fetch("http://localhost:3000/api/saving/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/despesas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resForm.ok || !resDespesas.ok) throw new Error("Erro nos dados");

        const form = await resForm.json();
        const despesas = await resDespesas.json();

        // Filtrar despesas do mês atual
        const despesasDoMes = despesas.filter((d) => {
          const data = new Date(d.data);
          return data.getMonth() + 1 === mesAtual && data.getFullYear() === anoAtual;
        });

        setFormData(form);
        setDespesasMes(despesasDoMes);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar dados necessários.");
      }
    };

    fetchDados();
  }, []);

  const resultados = formData
    ? gerarAnalisesSelecionadas({
        savingData: formData,
        despesasMes,
        analisesAtivas,
        mes: mesAtual,
        ano: anoAtual,
      })
    : [];

  return (
    <div className="analises-avancadas-wrapper">
      <h2>🧠 Análises Avançadas</h2>
      <p>Acede a insights financeiros automáticos e personalizados.</p>

      <MenuAnalises analisesAtivas={analisesAtivas} setAnalisesAtivas={setAnalisesAtivas} />

      {erro && <p className="erro">{erro}</p>}

      {resultados.length > 0 && (
        <div className="analises-resultados-box">
          {resultados.map((frase, i) => (
            <div key={i} className="analise-item">{frase}</div>
          ))}
        </div>
      )}
    </div>
  );
}
