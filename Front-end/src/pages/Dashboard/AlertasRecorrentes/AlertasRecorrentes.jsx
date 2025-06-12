import { useEffect, useState } from 'react'
import './AlertasRecorrentes.css'
import {
  getEstadoInspecaoDetalhado,
  isSeguroExpirado,
  isSeguroPertoDoFim
} from '../../../components/Alertas/veiculoAlertas'

export default function AlertasRecorrentes() {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    const carregarAlertas = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const hoje = new Date()

        const [resPagamentos, resVeiculos] = await Promise.all([
          fetch('http://localhost:3000/api/payments/user', { headers }),
          fetch('http://localhost:3000/api/veiculos', { headers })
        ])

        const pagamentos = await resPagamentos.json()
        const veiculos = await resVeiculos.json()
        const lista = []

        // Subscrições
        pagamentos.forEach(p => {
          if (!p.ultimoPagamento) {
            lista.push({
              nome: p.nome,
              mensagem: 'Nunca foi pago',
              tipo: 'urgente',
              origem: 'sub'
            })
            return
          }

          const ultima = new Date(p.ultimoPagamento)
          const proxima = new Date(ultima.getFullYear(), ultima.getMonth() + 1, ultima.getDate())
          const diffDias = Math.ceil((proxima - hoje) / (1000 * 60 * 60 * 24))

          if (diffDias < 0) {
            lista.push({
              nome: p.nome,
              mensagem: `Renovação em atraso (${Math.abs(diffDias)} dias)`,
              tipo: 'urgente',
              origem: 'sub'
            })
          } else if (diffDias <= 3) {
            lista.push({
              nome: p.nome,
              mensagem: `Renova em ${diffDias} dia(s)`,
              tipo: 'aviso',
              origem: 'sub'
            })
          }
        })

        // Veículos
        veiculos.forEach(v => {
          const nomeVeiculo = `${v.marca} ${v.modelo}`

          const inspecao = getEstadoInspecaoDetalhado(v.ultimaInspecao, v.mesEntrada)
          if (inspecao === 'expirada') {
            lista.push({
              nome: nomeVeiculo,
              mensagem: 'Inspeção expirada',
              tipo: 'urgente',
              origem: 'carro'
            })
          } else if (inspecao?.startsWith('Faltam')) {
            lista.push({
              nome: nomeVeiculo,
              mensagem: `Inspeção: ${inspecao}`,
              tipo: 'aviso',
              origem: 'carro'
            })
          }

          if (isSeguroExpirado(v.seguroAte)) {
            lista.push({
              nome: nomeVeiculo,
              mensagem: 'Seguro expirado',
              tipo: 'urgente',
              origem: 'carro'
            })
          } else if (isSeguroPertoDoFim(v.seguroAte)) {
            lista.push({
              nome: nomeVeiculo,
              mensagem: 'Seguro prestes a expirar',
              tipo: 'aviso',
              origem: 'carro'
            })
          }
        })

        lista.sort((a, b) => {
          const prioridade = { urgente: 1, aviso: 2 }
          return prioridade[a.tipo] - prioridade[b.tipo]
        })

        setAlertas(lista)
      } catch (err) {
        console.error('Erro ao carregar alertas:', err)
      }
    }

    carregarAlertas()
  }, [])

  return (
    <div className="alertas-recorrentes">
      <h3>🔔 Alertas importantes</h3>

      {alertas.length === 0 ? (
        <p className="sem-alertas">Nenhum alerta por agora. ✨</p>
      ) : (
        <>
          {alertas.some(a => a.origem === 'sub') && (
            <>
              <h4 className="secao-alerta">📺 Subscrições</h4>
              <ul className="lista-alertas">
                {alertas
                  .filter(a => a.origem === 'sub')
                  .map((a, i) => (
                    <li key={`sub-${i}`} className={a.tipo === 'urgente' ? 'alerta-vermelho' : 'alerta-amarelo'}>
                      <strong>{a.nome}</strong>: {a.mensagem}
                    </li>
                  ))}
              </ul>
            </>
          )}

          {alertas.some(a => a.origem === 'carro') && (
            <>
              <h4 className="secao-alerta">🚗 Veículos</h4>
              <ul className="lista-alertas">
                {alertas
                  .filter(a => a.origem === 'carro')
                  .map((a, i) => (
                    <li key={`car-${i}`} className={a.tipo === 'urgente' ? 'alerta-vermelho' : 'alerta-amarelo'}>
                      <strong>{a.nome}</strong>: {a.mensagem}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
