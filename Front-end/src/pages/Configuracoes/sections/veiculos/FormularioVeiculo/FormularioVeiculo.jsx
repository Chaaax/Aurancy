import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import './FormularioVeiculo.css';
import CreatableSelect from 'react-select/creatable';
import DatePicker, { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt', pt);

export default function FormularioVeiculo({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ultimaInspecao, setUltimaInspecao] = useState(null);
  const [seguroAte, setSeguroAte] = useState(null);

  const API_KEY = '7bea7ecee4mshaa3cb1053f2b9e5p15b0cfjsn6ef90dffb9ad';
  const API_HOST = 'car-api2.p.rapidapi.com';

  const meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' }, { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];

  const anoAtual = new Date().getFullYear();
  const anosDisponiveis = Array.from({ length: anoAtual - 1979 }, (_, i) => 1980 + i);

  useEffect(() => {
    register('marca', { required: true });
  }, [register]);

  useEffect(() => {
    fetch('https://car-api2.p.rapidapi.com/api/makes?direction=asc&sort=make', {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    })
      .then(res => res.json())
      .then(data => {
        const lista = data.data.map(m => m.name || m.make).filter(Boolean).sort();
        setMarcas(lista);
      })
      .catch(err => console.error('Erro ao buscar marcas:', err));
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');

      const payload = {
        ...data,
        combustivel: data.combustivel || null,
        ultimaInspecao: ultimaInspecao ? ultimaInspecao.toISOString() : null,
        seguroAte: seguroAte ? seguroAte.toISOString() : null
      };

      console.log("Payload enviado:", payload);

      const response = await fetch('/api/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('🚗 Veículo adicionado com sucesso!');
        reset();
        onSuccess?.();
      } else {
        const errData = await response.json();
        alert('❌ Erro ao adicionar veículo: ' + (errData.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro no onSubmit:', err);
      alert('Erro de rede ou servidor.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-veiculo">
      <div className="form-grid">
        <div className="form-group">
          <label>Marca</label>
          <CreatableSelect
            classNamePrefix="select"
            options={marcas.map(m => ({ label: m, value: m }))}
            onChange={(option) => {
              const valor = option?.value || '';
              setMarcaSelecionada(valor);
              setValue('marca', valor, { shouldValidate: true });
            }}
            onInputChange={(inputValue, { action }) => {
              if (action === 'input-change') {
                setValue('marca', inputValue, { shouldValidate: true });
              }
            }}
            value={marcaSelecionada ? { label: marcaSelecionada, value: marcaSelecionada } : null}
            isClearable
            isSearchable
            placeholder="Escolha ou escreva a marca"
          />
          {errors.marca && <span className="form-error">⚠️ Campo obrigatório</span>}
        </div>

        <div className="form-group">
          <label>Modelo</label>
          <input {...register('modelo', { required: true })} placeholder="Escreva o modelo" />
          {errors.modelo && <span className="form-error">⚠️ Campo obrigatório</span>}
        </div>

        <div className="form-group">
          <label>Matrícula</label>
          <input
            {...register('matricula', {
              required: 'Obrigatório',
              pattern: {
                value: /^[A-Z]{2}-\d{2}-[A-Z]{2}$|^\d{2}-[A-Z]{2}-\d{2}$|^\d{2}-\d{2}-[A-Z]{2}$|^[A-Z]{2}-\d{2}-\d{2}$/,
                message: 'Formato inválido. Ex: 00-AA-00'
              },
              validate: async (value) => {
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch(`/api/veiculos/verificar-matricula?matricula=${encodeURIComponent(value)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const data = await res.json();
                  return data.existe ? 'Esta matrícula já está registada.' : true;
                } catch (err) {
                  return 'Erro ao verificar matrícula';
                }
              }
            })}
            placeholder="Ex: 00-AA-00"
            maxLength={10}
            onChange={(e) => {
              let input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (input.length > 2) input = input.slice(0, 2) + '-' + input.slice(2);
              if (input.length > 5) input = input.slice(0, 5) + '-' + input.slice(5);
              if (input.length > 8) input = input.slice(0, 8) + '-' + input.slice(8);
              setValue('matricula', input, { shouldValidate: true });
            }}
          />
          {errors.matricula && <span className="form-error">⚠️ {errors.matricula.message}</span>}
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <select {...register('tipo', { required: true })}>
            <option value="">Selecione</option>
            <option value="Ligeiro">Ligeiro</option>
            <option value="SUV">SUV</option>
            <option value="Desportivo">Desportivo</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Familiar">Familiar</option>
            <option value="Comercial">Comercial</option>
            <option value="Pesado">Pesado</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.tipo && <span className="form-error">⚠️ Campo obrigatório</span>}
        </div>

        <div className="form-group">
          <label>Ano</label>
          <select {...register('ano', { required: true })}>
            <option value="">Selecione</option>
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
          {errors.ano && <span className="form-error">⚠️ Campo obrigatório</span>}
        </div>

        <div className="form-group">
          <label>Mês da Matrícula</label>
          <select {...register('mesEntrada', { required: true })}>
            <option value="">Selecione</option>
            {meses.map((mes) => (
              <option key={mes.value} value={mes.value}>{mes.label}</option>
            ))}
          </select>
          {errors.mesEntrada && <span className="form-error">⚠️ Campo obrigatório</span>}
        </div>

        <div className="form-group">
          <label>Km Atual</label>
          <input
            type="number"
            list="sugestoes-km"
            {...register('kmAtual', { required: true, min: 0 })}
            placeholder="Ex: 75000"
          />
          <datalist id="sugestoes-km">
            {[5000, 10000, 20000, 50000, 75000, 100000, 150000, 200000, 250000, 300000].map(km => (
              <option key={km} value={km} />
            ))}
          </datalist>
          {errors.kmAtual && <span className="form-error">⚠️ Valor inválido</span>}
        </div>

        <div className="form-group">
          <label>Combustível</label>
          <select {...register('combustivel')}>
            <option value="">Selecione</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
            <option value="GPL">GPL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Última Inspeção</label>
          <DatePicker
            selected={ultimaInspecao}
            onChange={(date) => setUltimaInspecao(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecionar data"
            locale="pt"
            className="input-data"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date('2099-12-31')}
          />
        </div>

        <div className="form-group">
          <label>Seguro até</label>
          <DatePicker
            selected={seguroAte}
            onChange={(date) => setSeguroAte(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecionar data"
            locale="pt"
            className="input-data"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date('2099-12-31')}
          />
        </div>
      </div>

      <button type="submit" className="form-button">Adicionar Veículo</button>
    </form>
  );
}
