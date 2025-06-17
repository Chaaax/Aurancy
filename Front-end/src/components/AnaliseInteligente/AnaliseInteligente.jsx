import { useEffect, useState } from 'react'
import './AnaliseInteligente.css'

const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const anosDisponiveis = Array.from({ length: 8 }, (_, i) => 2023 + i)

const mesAtual = new Date().getMonth() + 1
const anoAtual = new Date().getFullYear()

export default function AnaliseInteligente() {
  const [frases, setFrases] = useState([])
  const [erro, setErro] = useState('')
  const [modo, setModo] = useState('mes')

  const [mes1, setMes1] = useState(mesAtual)
  const [ano1, setAno1] = useState(anoAtual)
  const [mes2, setMes2] = useState(mesAtual === 1 ? 12 : mesAtual - 1)
  const [ano2, setAno2] = useState(mesAtual === 1 ? anoAtual - 1 : anoAtual)

  const [periodoUnico, setPeriodoUnico] = useState({ mesInicio: mesAtual, mesFim: mesAtual, ano: anoAtual })

  const gerarListaMeses = (mesInicio, mesFim, ano) => {
    const meses = []
    for (let m = mesInicio; m <= mesFim; m++) {
      meses.push({ mes: m, ano })
    }
    return meses
  }

  const fetchPeriodo = async (listaMeses) => {
    const token = localStorage.getItem('token')
    let total = 0
    let categorias = {}
    let diasTotais = 0
    let totaisPorMes = {}
    let valoresPorCategoria = {}

    for (const { mes, ano } of listaMeses) {
      const res = await fetch(`http://localhost:3000/api/despesas/mensal?mes=${mes}&ano=${ano}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        let subtotal = 0
        for (const [cat, val] of Object.entries(data.categorias || {})) {
          categorias[cat] = (categorias[cat] || 0) + val
          subtotal += val
          if (!valoresPorCategoria[cat]) valoresPorCategoria[cat] = []
          valoresPorCategoria[cat].push(val)
        }
        totaisPorMes[`${ano}-${mes}`] = subtotal
        total += subtotal
        diasTotais += new Date(ano, mes, 0).getDate()
      }
    }

    return { total, categorias, diasTotais, totaisPorMes, valoresPorCategoria }
  }

  useEffect(() => {
    const carregarAnalise = async () => {
      try {
        setFrases([])
        setErro('')

        if (modo === 'tendencia') {
          const lista = gerarListaMeses(1, 12, anoAtual)
          const dados = await fetchPeriodo(lista)
          if (Object.keys(dados.totaisPorMes).length === 0) {
            setErro('Sem dados suficientes para tendência.')
            return
          }

          const ordenado = Object.entries(dados.totaisPorMes).sort((a, b) => {
            const [anoA, mesA] = a[0].split('-').map(Number)
            const [anoB, mesB] = b[0].split('-').map(Number)
            return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1)
          })

          const mesMaisAlto = ordenado.slice().sort((a, b) => b[1] - a[1])[0]
          const [anoMes, valor] = mesMaisAlto
          const [anoTop, mesTopIndex] = anoMes.split('-').map(Number)
          const frase1 = `O mês com mais gastos no ano foi ${nomesMeses[mesTopIndex - 1]} (${valor.toFixed(2)}€).`

          const medias = ordenado.map(([_, v]) => v)
          const media = medias.reduce((acc, v) => acc + v, 0) / medias.length
          const desvio = Math.sqrt(medias.map(v => (v - media) ** 2).reduce((acc, v) => acc + v, 0) / medias.length)
          const frase2 = `A variação mensal dos teus gastos foi de ±${desvio.toFixed(2)}€, indicando ${desvio < 50 ? 'estabilidade' : 'variação significativa'}.`

          let tendencia = 'estável'
          if (ordenado.length >= 3) {
            const diffs = ordenado.slice(1).map(([_, v], i) => v - ordenado[i][1])
            if (diffs.every(d => d > 0)) tendencia = 'crescente'
            else if (diffs.every(d => d < 0)) tendencia = 'decrescente'
          }
          const frase3 = `A tendência dos teus gastos ao longo do ano foi: ${tendencia}.`

          setFrases([frase1, frase2, frase3])
          return
        }

        let lista1 = []
        if (modo === 'mes') {
          lista1 = [{ mes: mes1, ano: ano1 }, { mes: mes2, ano: ano2 }]
        } else {
          lista1 = gerarListaMeses(periodoUnico.mesInicio, periodoUnico.mesFim, periodoUnico.ano)
        }

        const dados = await fetchPeriodo(lista1)

        if (dados.total === 0) {
          setErro('Sem dados disponíveis.')
          return
        }

        const frasesGeradas = []

        if (modo === 'mes') {
          const listaMes1 = [{ mes: mes1, ano: ano1 }]
          const listaMes2 = [{ mes: mes2, ano: ano2 }]
          const dados1 = await fetchPeriodo(listaMes1)
          const dados2 = await fetchPeriodo(listaMes2)

          const diff = dados1.total - dados2.total
          const variacao = dados2.total === 0 ? null : Math.round((diff / dados2.total) * 100)
          const frase1 = dados2.total === 0
            ? `Este é o primeiro mês com dados.`
            : `O gasto total ${variacao > 0 ? 'aumentou' : 'diminuiu'} ${Math.abs(variacao)}% face ao mês comparado.`
          frasesGeradas.push(frase1)
        }

        const [categoriaTop] = Object.entries(dados.categorias).sort((a, b) => b[1] - a[1])
        const percent = ((categoriaTop[1] / dados.total) * 100).toFixed(0)
        frasesGeradas.push(`A categoria com maior gasto foi ${categoriaTop[0]} (${percent}% do total).`)

        const mesTop = Object.entries(dados.totaisPorMes).sort((a, b) => b[1] - a[1])[0]
        const [anoMes, valor] = mesTop
        const [anoTop, mesTopIndex] = anoMes.split('-').map(Number)
        frasesGeradas.push(`O mês com mais gastos foi ${nomesMeses[mesTopIndex - 1]} (${valor.toFixed(2)}€).`)

        frasesGeradas.push(`Gasto médio diário no período: ${(dados.total / dados.diasTotais).toFixed(2)}€.`)

        const desvios = Object.entries(dados.valoresPorCategoria).map(([cat, valores]) => {
          const media = valores.reduce((a, b) => a + b, 0) / valores.length
          const desvio = Math.sqrt(valores.map(v => (v - media) ** 2).reduce((a, b) => a + b, 0) / valores.length)
          return { cat, desvio }
        }).sort((a, b) => a.desvio - b.desvio)

        const maisConstantes = desvios.slice(0, 3).map(d => d.cat).join(', ')
        frasesGeradas.push(`As 3 categorias mais consistentes foram: ${maisConstantes}.`)

        setFrases(frasesGeradas)
      } catch (err) {
        console.error(err)
        setErro('Erro ao carregar análise.')
      }
    }

    carregarAnalise()
  }, [modo, mes1, ano1, mes2, ano2, periodoUnico])

  return (
    <div className="analise-container">
      <h3 className="grafico-titulo">Análise Inteligente</h3>
      <div className="selecao-meses">
        <label>
          Tipo de Análise:
          <select value={modo} onChange={e => setModo(e.target.value)}>
            <option value="mes">Comparar Meses</option>
            <option value="periodoUnico">Analisar Período</option>
            <option value="tendencia">Tendência Anual</option>
          </select>
        </label>

        {modo === 'mes' && (
          <>
            <label>Mês 1:
              <select value={mes1} onChange={e => setMes1(Number(e.target.value))}>
                {nomesMeses.map((nome, i) => <option key={i} value={i + 1}>{nome}</option>)}
              </select>
            </label>
            <label>Ano 1:
              <select value={ano1} onChange={e => setAno1(Number(e.target.value))}>
                {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label>Mês 2:
              <select value={mes2} onChange={e => setMes2(Number(e.target.value))}>
                {nomesMeses.map((nome, i) => <option key={i} value={i + 1}>{nome}</option>)}
              </select>
            </label>
            <label>Ano 2:
              <select value={ano2} onChange={e => setAno2(Number(e.target.value))}>
                {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          </>
        )}

        {modo === 'periodoUnico' && (
          <>
            <label>Mês Início:
              <select value={periodoUnico.mesInicio} onChange={e => setPeriodoUnico(p => ({ ...p, mesInicio: Number(e.target.value) }))}>
                {nomesMeses.map((nome, i) => <option key={i} value={i + 1}>{nome}</option>)}
              </select>
            </label>
            <label>Mês Fim:
              <select value={periodoUnico.mesFim} onChange={e => setPeriodoUnico(p => ({ ...p, mesFim: Number(e.target.value) }))}>
                {nomesMeses.map((nome, i) => <option key={i} value={i + 1}>{nome}</option>)}
              </select>
            </label>
            <label>Ano:
              <select value={periodoUnico.ano} onChange={e => setPeriodoUnico(p => ({ ...p, ano: Number(e.target.value) }))}>
                {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          </>
        )}
      </div>

      {erro && <p className="erro">{erro}</p>}
      {!erro && frases.map((frase, idx) => <p key={idx}>🧠 {frase}</p>)}
    </div>
  )
}

