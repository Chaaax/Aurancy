// src/components/Dashboard/DespesasMensaisChart.jsx
import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './DespesasMensaisChart.css'

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#eab308"]

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function DespesasMensaisChart() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const fetchDespesas = async () => {
    setLoading(true)
    setErro('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/api/despesas/mensal?mes=${mes}&ano=${ano}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json()

      if (res.ok) {
        const categorias = Object.entries(result.categorias).map(([name, value]) => ({ name, value }))
        setDados(categorias)
      } else {
        setErro(result.error || 'Erro ao obter dados')
      }
    } catch (err) {
      setErro('Erro de rede')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDespesas()
  }, [mes, ano])

  return (
    <div className="grafico-despesas">
      <h2>Despesas em {meses[mes - 1]} {ano}</h2>

      <div className="selecao-tempo">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {meses.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => hoje.getFullYear() - i).map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {loading ? <p>A carregar...</p> : erro ? <p className="erro">{erro}</p> : (
       <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dados}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              label
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
