import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import './EditarVeiculo.css';

export default function EditarVeiculo({ veiculo, onFechar, onAtualizar }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (veiculo) {
      Object.entries(veiculo).forEach(([chave, valor]) => setValue(chave, valor));
    }
  }, [veiculo, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/veiculos/${veiculo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const atualizado = await res.json();
        onAtualizar(atualizado);
        onFechar();
      } else {
        const erro = await res.json();
        alert('Erro ao atualizar: ' + (erro.error || 'erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao comunicar com o servidor.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Veículo</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <input {...register('marca', { required: true })} placeholder="Marca" />
          <input {...register('modelo', { required: true })} placeholder="Modelo" />
          <input {...register('matricula', { required: true })} placeholder="Matrícula" />
          <input type="number" {...register('ano', { required: true })} placeholder="Ano" />
          <input type="number" {...register('mesEntrada')} placeholder="Mês (1-12)" />
          <input {...register('tipo', { required: true })} placeholder="Tipo" />
          <input type="number" {...register('kmAtual')} placeholder="Km Atual" />

          <select {...register('combustivel')}>
            <option value="">Combustível</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
            <option value="GPL">GPL</option>
          </select>

          <input type="date" {...register('ultimaInspecao')} />
          <input type="date" {...register('seguroAte')} />

          <div className="modal-buttons">
            <button type="submit" className="salvar">Guardar</button>
            <button type="button" className="cancelar" onClick={onFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
