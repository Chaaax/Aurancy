import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import CountUp from "react-countup";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function GraficoLinhasPremium() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [dados, setDados] = useState([]);
  const [anosDisponiveis, setAnosDisponiveis] = useState([]);
  const [rendimentoMensal, setRendimentoMensal] = useState(null);
  const [poupancaAtual, setPoupancaAtual] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem("token");

        const [resDespesas, resForm] = await Promise.all([
          fetch("http://localhost:3000/api/despesas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/saving/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const todasDespesas = await resDespesas.json();
        const formData = await resForm.json();

        const inicioMes = new Date(ano, mes - 1, 1);
        const fimMes = new Date(ano, mes, 0, 23, 59, 59);

        const despesasMes = todasDespesas.filter((d) => {
          const data = new Date(d.data);
          return data >= inicioMes && data <= fimMes;
        });

        despesasMes.sort((a, b) => new Date(a.data) - new Date(b.data));

        let acumulado = 0;
        const dadosAcumulados = despesasMes.map((d) => {
          acumulado += Number(d.valor);
          return {
            dia: new Date(d.data).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "2-digit"
            }),
            Total: +acumulado.toFixed(2)
          };
        });

        setDados(dadosAcumulados);
        const rendimento = Number(formData.rendimentoMensal) || null;
        setRendimentoMensal(rendimento);
        setPoupancaAtual(rendimento !== null ? +(rendimento - acumulado).toFixed(2) : null);
      } catch (err) {
        console.error("Erro ao carregar dados do gráfico:", err);
        setErro("Erro ao obter dados");
      }
    };

    fetchDados();
  }, [mes, ano]);

  useEffect(() => {
    const fetchAnos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/despesas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const despesas = await res.json();
        const anos = [...new Set(despesas.map((d) => new Date(d.data).getFullYear()))];
        setAnosDisponiveis(anos.sort((a, b) => a - b));
      } catch (err) {
        console.error("Erro ao buscar anos disponíveis:", err);
      }
    };

    fetchAnos();
  }, []);

  return (
    <div className="grafico-linhas-premium">
      <h2>📈 Evolução Acumulada de Despesas - {meses[mes - 1]} {ano}</h2>

      <div className="selecao-tempo" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {meses.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {anosDisponiveis.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {poupancaAtual !== null && (
          <div style={{
            marginLeft: "auto",
            backgroundColor: "#10b98120",
            color: "#10b981",
            padding: "6px 12px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "0.95rem"
          }}>
            💚 Poupança Atual:&nbsp;
            <CountUp
              end={poupancaAtual}
              decimals={2}
              duration={1.5}
              separator="."
              decimal=","
              suffix=" €"
            />
          </div>
        )}
      </div>

      {erro ? (
        <p className="erro">{erro}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis
              domain={[0, Math.max(...dados.map(d => d.Total), rendimentoMensal || 0) * 1.2]}
              tickFormatter={(value) => `${value}€`}
            />

            {rendimentoMensal !== null && (
              <ReferenceLine
                y={rendimentoMensal}
                stroke="gold"
                strokeWidth={3}
                label={{
                  value: `💰 Rendimento Mensal (€${rendimentoMensal})`,
                  position: "top",
                  fill: "gold",
                  fontSize: 12,
                }}
              />
            )}

            <Tooltip
              formatter={(value) => [`${value} €`, "Despesas"]}
              labelFormatter={(label) => `📅 Dia: ${label}`}
              contentStyle={{ backgroundColor: "#1c1c3c", borderRadius: 10, borderColor: "#6366f1" }}
              labelStyle={{ color: "white" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#3b82f6"
              name="Despesas Acumuladas (€)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}