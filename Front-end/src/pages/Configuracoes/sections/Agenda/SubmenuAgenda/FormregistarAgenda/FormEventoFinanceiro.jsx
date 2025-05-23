import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CategoriaDropdown from '../../../Despesas/SubmenuDespesas/FormDespesas/CategoriaDropdown/CategoriaDropdown'
import './FormEventoFinanceiro.css'

export default function FormEventoFinanceiro() {
  const { register, handleSubmit, reset } = useForm()
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      categoria: categoriaSelecionada,
      valor: parseFloat(data.valor),
      data: new Date(data.data)
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
      } else {
        alert('Erro ao registar evento.')
      }
    } catch (error) {
      console.error(error)
      alert('Erro de rede.')
    }
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
        <input type="date" {...register('data')} required />
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