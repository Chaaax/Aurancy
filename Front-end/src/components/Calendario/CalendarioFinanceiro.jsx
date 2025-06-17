import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './CalendarioFinanceiro.css'
import FormEventoFinanceiro from '../../pages/Configuracoes/sections/Agenda/SubmenuAgenda/FormregistarAgenda/FormEventoFinanceiro'

export default function CalendarioFinanceiro() {
  const [eventos, setEventos] = useState([])
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [posicao, setPosicao] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState(false)

  useEffect(() => {
    async function carregarEventos() {
      try {
        const token = localStorage.getItem('token')
        const mes = new Date().getMonth() + 1
        const ano = new Date().getFullYear()

        const res = await fetch(`http://localhost:3000/api/eventos?mes=${mes}&ano=${ano}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const dados = await res.json()

        const formatados = dados.map(ev => ({
          id: ev.id,
          title: `${ev.titulo}${ev.valor ? ` - ${ev.valor.toFixed(2)}€` : ''}`,
          date: ev.data.split('T')[0],
          color: '#3b82f6',
          extendedProps: {
            categoria: ev.categoria || 'Não categorizadas',
            notas: ev.notas || ''
          }
        }))

        setEventos(formatados)
      } catch (err) {
        console.error('Erro ao carregar eventos:', err)
      }
    }

    carregarEventos()
  }, [])

  useEffect(() => {
    function handleClickFora(event) {
      const card = document.querySelector('.card-evento')
      if (card && !card.contains(event.target)) {
        setEventoSelecionado(null)
      }
    }

    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  const handleClick = (info) => {
    setEventoSelecionado({
      title: info.event.title,
      data: info.event.start.toLocaleDateString(),
      categoria: info.event.extendedProps.categoria,
      notas: info.event.extendedProps.notas
    })

    const padding = 260 // largura aproximada do card + margem
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    let x = info.jsEvent.clientX + 10
    let y = info.jsEvent.clientY + 10

    if (x + padding > windowWidth) {
      x = windowWidth - padding
    }
    if (y + 180 > windowHeight) {
      y = windowHeight - 190
    }

    setPosicao({ x, y })
  }

  const fecharCard = () => setEventoSelecionado(null)

  return (
    <div className="calendario-container">
      <button
      className="btn-marcar-evento"
      onClick={() => navigate('/configuracoes?secao=agenda&subsecao=agendar')}
    >
      Marcar Evento
    </button>


      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        eventClick={handleClick}
        locale="pt"
        firstDay={1}
      />

      {eventoSelecionado && (
        <div className="card-evento" style={{ top: posicao.y, left: posicao.x, position: 'fixed' }}>
          <button className="fechar" onClick={fecharCard}>✖</button>
          <h3>{eventoSelecionado.title}</h3>
          <p><strong>📅</strong> {eventoSelecionado.data}</p>
          <p><strong>📌</strong> {eventoSelecionado.categoria}</p>
          {eventoSelecionado.notas && (
            <p><strong>🗒️</strong> {eventoSelecionado.notas}</p>
          )}
        </div>
      )}
    </div>
  )
}




