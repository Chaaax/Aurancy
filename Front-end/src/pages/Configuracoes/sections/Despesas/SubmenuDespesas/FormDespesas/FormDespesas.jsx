import 'react-datepicker/dist/react-datepicker.css'
import './FormDespesas.css'
import { useState } from 'react'
import CategoriaDropdown from './CategoriaDropdown/CategoriaDropdown'
import DatePicker, { registerLocale } from 'react-datepicker'
import pt from 'date-fns/locale/pt'

registerLocale('pt', pt)

export default function FormDespesas({ onDespesaCriada }) {
  const [titulo, setTitulo] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState(null)
  const [recorrencia, setRecorrencia] = useState('única')
  const [dataInicio, setDataInicio] = useState(null)
  const [dataFim, setDataFim] = useState(null)
  const [notas, setNotas] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    const token = localStorage.getItem('token')
    if (!token) {
      setErro('Utilizador não autenticado.')
      return
    }

    const payload = {
      descricao: titulo,
      valor,
      categoria,
      notas,
      recorrencia
    }

    let url = 'http://localhost:3000/api/despesas'

    if (recorrencia === 'única') {
      if (!data) {
        setErro('Seleciona a data da despesa.')
        return
      }
      payload.descricao = titulo
      payload.data = data.toISOString()
    } else {
      if (!dataInicio || !dataFim) {
        setErro('Seleciona as datas de início e fim.')
        return
      }
      payload.titulo = titulo
      payload.dataInicio = dataInicio.toISOString()
      payload.dataFim = dataFim.toISOString()
      url = 'http://localhost:3000/api/recorrentes'
    }
    console.log('Payload a enviar:', payload)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      if (!res.ok) {
        setErro(result.error || 'Erro ao guardar despesa.')
      } else {
        setSucesso('Despesa registada com sucesso.')
        setTitulo('')
        setValor('')
        setCategoria('')
        setData(null)
        setDataInicio(null)
        setDataFim(null)
        setRecorrencia('única')
        setNotas('')
        if (onDespesaCriada) onDespesaCriada(result)
      }
    } catch (err) {
      setErro('Erro na comunicação com o servidor.')
    }
  }

  const renderCustomHeader = ({ date, changeYear, changeMonth }) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(+value)}
          >
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={date.getMonth()}
            onChange={({ target: { value } }) => changeMonth(+value)}
          >
            {meses.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div style={{ textAlign: 'center', fontSize: '1rem', fontWeight: '600', color: '#e5e7eb' }}>
          {meses[date.getMonth()]} {date.getFullYear()}
        </div>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="form-despesa-container">
      <h2>Registar nova despesa</h2>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />

      <CategoriaDropdown onSelect={(valor) => setCategoria(valor)} />

      <label htmlFor="recorrencia">Recorrência da despesa:</label>
      <select
        id="recorrencia"
        value={recorrencia}
        onChange={(e) => setRecorrencia(e.target.value)}
      >
        <option value="única">Única</option>
        <option value="mensal">Mensal</option>
        <option value="semanal">Semanal</option>
        <option value="anual">Anual</option>
      </select>

      {recorrencia === 'única' ? (
        <>
          <label>Data da despesa:</label>
          <DatePicker
            selected={data}
            onChange={(date) => setData(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecionar data"
            locale="pt"
            showPopperArrow={false}
            className="input-data"
            maxDate={new Date('2099-12-31')}
            renderCustomHeader={renderCustomHeader}
          />
        </>
      ) : (
        <>
          <label>Data de início:</label>
          <DatePicker
            selected={dataInicio}
            onChange={(date) => setDataInicio(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecionar data de início"
            locale="pt"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="input-data"
            maxDate={new Date('2099-12-31')}
            renderCustomHeader={renderCustomHeader}
          />

          <label>Repetir até:</label>
          <DatePicker
            selected={dataFim}
            onChange={(date) => setDataFim(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecionar data de fim"
            locale="pt"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="input-data"
            maxDate={new Date('2099-12-31')}
            renderCustomHeader={renderCustomHeader}
          />
        </>
      )}

      <textarea
        placeholder="Notas (opcional)"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={3}
      ></textarea>

      <button type="submit">Guardar</button>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
    </form>
  )
}


