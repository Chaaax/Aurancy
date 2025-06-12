import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import './EvolucaoMensalChart.css'

const anosDisponiveis = Array.from({ length: 8 }, (_, i) => 2025 + i)
const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function EvolucaoMensalChart() {
  const [ano, setAno] = useState(new Date().getFullYear())
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true)
      setErro('')
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:3000/api/estatisticas/mensal/${ano}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await res.json()

        if (res.ok) {
          const dadosFormatados = result.map(item => ({
              mes: nomesMeses[item.mes - 1],
              total: (item.total || 0) + (item.subscricoes || 0)
            }))
          setDados(dadosFormatados)
        } else {
          setErro(result.error || 'Erro ao obter dados')
        }
      } catch {
        setErro('Erro de rede')
      }
      setLoading(false)
    }

    fetchDados()
  }, [ano])

  return (
    <div className="grafico-evolucao">
      <h2>Evolução Mensal das Despesas - {ano}</h2>

      <div className="selecao-ano">
        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {anosDisponiveis.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {loading ? <p>A carregar...</p> : erro ? <p className="erro">{erro}</p> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <XAxis 
              dataKey="mes" 
              interval={0}
              tick={{ fill: '#e0e0ff', fontSize: 13 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}