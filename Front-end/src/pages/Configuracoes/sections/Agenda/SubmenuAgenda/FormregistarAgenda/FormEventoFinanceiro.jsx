import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CategoriaDropdown from '../../../Despesas/SubmenuDespesas/FormDespesas/CategoriaDropdown/CategoriaDropdown'
import './FormEventoFinanceiro.css'

import DatePicker, { registerLocale } from 'react-datepicker'
import pt from 'date-fns/locale/pt'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('pt', pt)

export default function FormEventoFinanceiro() {
  const { register, handleSubmit, reset } = useForm()
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [dataSelecionada, setDataSelecionada] = useState(null)

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      categoria: categoriaSelecionada,
      valor: parseFloat(data.valor || 0),
      data: dataSelecionada?.toISOString()
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert('Evento registado com sucesso!')
        reset()
        setCategoriaSelecionada('')
        setDataSelecionada(null)
      } else {
        alert('Erro ao registar evento.')
      }
    } catch (error) {
      console.error(error)
      alert('Erro de rede.')
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
    <form className="form-evento" onSubmit={handleSubmit(onSubmit)}>
      <h3>📅 Novo Evento</h3>

      <div className="form-linha">
        <label>Título</label>
        <input {...register('titulo')} placeholder="Ex: Inspeção do carro" required />
      </div>

      <div className="form-linha">
        <label>Data</label>
        <DatePicker
          selected={dataSelecionada}
          onChange={(date) => setDataSelecionada(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecionar data"
          locale="pt"
          showPopperArrow={false}
          className="input-data"
          maxDate={new Date('2099-12-31')}
          renderCustomHeader={renderCustomHeader}
        />
      </div>

      <div className="form-linha">
        <label>Valor (€)</label>
        <input type="number" step="0.01" {...register('valor')} placeholder="Opcional" />
      </div>

      <div className="form-linha">
        <label>Categoria</label>
        <CategoriaDropdown onSelect={setCategoriaSelecionada} />
      </div>

      <div className="form-linha">
        <label>Notas</label>
        <textarea {...register('notas')} placeholder="Detalhes ou lembrete opcional" />
      </div>

      <button type="submit">Guardar evento</button>
    </form>
  )
}
