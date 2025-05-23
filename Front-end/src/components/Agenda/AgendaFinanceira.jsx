import { useEffect, useState } from 'react'
import './AgendaFinanceira.css'


const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function AgendaFinanceira() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const fetchEventos = async () => {
    setLoading(true)
    setErro('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/api/eventos?mes=${mes}&ano=${ano}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json()

      if (res.ok) {
        const agrupados = agruparPorData(result)
        setEventos(agrupados)
      } else {
        setErro(result.error || 'Erro ao obter eventos')
      }
    } catch {
      setErro('Erro de rede')
    }
    setLoading(false)
  }

  const agruparPorData = (lista) => {
    const mapa = {}
    lista.forEach(ev => {
      const data = new Date(ev.data).toLocaleDateString('pt-PT', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
      if (!mapa[data]) mapa[data] = []
      mapa[data].push(ev)
    })
    return mapa
  }

  useEffect(() => {
    fetchEventos()
  }, [mes, ano])

  return (
    <div className="agenda-financeira">
      <h2>Agenda Financeira - {meses[mes - 1]} {ano}</h2>

      <div className="selecao-tempo">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {meses.map((m, idx) => (
            <option key={m} value={idx + 1}>{m}</option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => hoje.getFullYear() - i).map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {loading ? <p>A carregar...</p> : erro ? <p className="erro">{erro}</p> : (
        <div className="lista-eventos">
          {Object.entries(eventos).map(([data, eventosDoDia]) => (
            <div key={data} className="dia-evento">
              <h4>{data}</h4>
              <ul>
                {eventosDoDia.map(ev => (
                  <li key={ev.id}>
                    <strong>{ev.titulo}</strong>{ev.valor ? ` - ${ev.valor.toFixed(2)} €` : ''}<br />
                    <small>{ev.categoria || 'Sem categoria'}</small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
