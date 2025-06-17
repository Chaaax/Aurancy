import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
import 'react-datepicker/dist/react-datepicker.css';
import './EditarVeiculo.css';

registerLocale('pt', pt);

export default function EditarVeiculo({ veiculo, onFechar, onAtualizar }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (veiculo) {
      Object.entries(veiculo).forEach(([chave, valor]) => {
        if (chave === 'ultimaInspecao' || chave === 'seguroAte') {
          setValue(chave, valor ? new Date(valor) : null);
        } else {
          setValue(chave, valor);
        }
      });
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

          <Controller
            control={control}
            name="ultimaInspecao"
            render={({ field }) => (
              <DatePicker
                placeholderText="Última Inspeção"
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MM/yyyy"
                locale="pt"
                className="input-data"
                maxDate={new Date('2099-12-31')}
              />
            )}
          />

          <Controller
            control={control}
            name="seguroAte"
            render={({ field }) => (
              <DatePicker
                placeholderText="Seguro até"
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MM/yyyy"
                locale="pt"
                className="input-data"
                maxDate={new Date('2099-12-31')}
              />
            )}
          />

          <div className="modal-buttons">
            <button type="submit" className="salvar">Guardar</button>
            <button type="button" className="cancelar" onClick={onFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

