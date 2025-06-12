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
  const [anosDisponiveis, setAnosDisponiveis] = useState([])
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const outerRadius = dados.length > 6 ? 60 : 65

  const fetchDespesas = async () => {
    setLoading(true)
    setErro('')
    try {
      const token = localStorage.getItem('token')

      const [resDespesas, resPagamentos] = await Promise.all([
        fetch(`http://localhost:3000/api/despesas/mensal?mes=${mes}&ano=${ano}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/payments/user`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const resultDespesas = await resDespesas.json()
      const resultPagamentos = await resPagamentos.json()

      if (!resDespesas.ok || !resPagamentos.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const categoriasBase = Object.entries(resultDespesas.categorias).map(([name, value]) => ({ name, value }))

      const subsPagasEsteMes = resultPagamentos.filter(p => {
        if (!p.ultimoPagamento) return false
        const data = new Date(p.ultimoPagamento)
        return data.getMonth() + 1 === mes && data.getFullYear() === ano
      })

      const totalSubs = subsPagasEsteMes.reduce((acc, s) => acc + s.valor, 0)

      const todasCategorias = [...categoriasBase]
      if (totalSubs > 0) {
        todasCategorias.push({ name: 'Subscrições', value: totalSubs })
      }

      setDados(todasCategorias)
    } catch (err) {
      setErro('Erro ao obter dados')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDespesas()
  }, [mes, ano])

  useEffect(() => {
    const fetchAnos = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:3000/api/despesas', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const despesas = await res.json()
        const anos = [...new Set(despesas.map(d => new Date(d.data).getFullYear()))]
        setAnosDisponiveis(anos.sort((a, b) => a - b))
      } catch (err) {
        console.error('Erro ao buscar anos disponíveis:', err)
      }
    }

    fetchAnos()
  }, [])

  return (
    <div className="grafico-despesas">
      <h2 className="grafico-titulo">Despesas em {meses[mes - 1]} {ano}</h2>

      <div className="selecao-tempo">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {meses.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {anosDisponiveis.map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      {loading ? <p>A carregar...</p> : erro ? <p className="erro">{erro}</p> : (
        <ResponsiveContainer width="100%"  height={300}>
          <PieChart>
            <Pie
              data={dados}
              dataKey="value"
              nameKey="name"
              outerRadius={outerRadius}
              innerRadius={40}
              fill="#8884d8"
              label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
              labelLine={false}
              cx="45%"  
              cy="50%"
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
