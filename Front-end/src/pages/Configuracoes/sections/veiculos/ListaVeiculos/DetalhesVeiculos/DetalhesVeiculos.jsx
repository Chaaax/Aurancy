import './DetalhesVeiculos.css';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import EditarVeiculo from './EditarVeiculo/EditarVeiculo';

export default function DetalhesVeiculo({ veiculo, onFechar, onAtualizar }) {
  if (!veiculo) return null;

  const [mostrarModal, setMostrarModal] = useState(false);

  const nomeMes = (num) => {
    const meses = [
      '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[num] || '';
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-PT');
  };

  const getEstadoInspecaoDetalhado = (ultimaInspecao, mesMatricula) => {
    if (!ultimaInspecao || !mesMatricula) return null;

    const ultima = new Date(ultimaInspecao);
    const hoje = new Date();

    const fim = new Date(ultima);
    fim.setFullYear(ultima.getFullYear() + 1);
    fim.setMonth(mesMatricula, 0); // último dia do mês
    fim.setHours(23, 59, 59, 999);

    const diasRestantes = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return 'expirada';
    if (diasRestantes <= 30) return `Faltam ${diasRestantes} dias`;
    if (diasRestantes <= 60) return 'Faltam 2 meses';
    if (diasRestantes <= 90) return 'Faltam 3 meses';
    return null;
  };

  const isSeguroExpirado = (dataSeguro) => {
    if (!dataSeguro) return false;
    return new Date() > new Date(dataSeguro);
  };

  const isSeguroPertoDoFim = (dataSeguro) => {
    if (!dataSeguro) return false;
    const diasRestantes = (new Date(dataSeguro) - new Date()) / (1000 * 60 * 60 * 24);
    return diasRestantes > 0 && diasRestantes <= 30;
  };

  const estadoInspecao = getEstadoInspecaoDetalhado(veiculo.ultimaInspecao, veiculo.mesEntrada);

  return (
    <>
      <div className="painel-detalhes">
        <button className="fechar-icone" onClick={onFechar} title="Fechar">
          <FaTimes />
        </button>

        <h3>{veiculo.marca} {veiculo.modelo}</h3>

        <p><strong>Matrícula:</strong> {veiculo.matricula}</p>
        <p><strong>Ano:</strong> {veiculo.ano}</p>
        <p><strong>Mês Matrícula:</strong> {nomeMes(veiculo.mesEntrada)}</p>
        <p><strong>Tipo:</strong> {veiculo.tipo}</p>
        <p><strong>Km Atual:</strong> {veiculo.kmAtual} km</p>
        <p><strong>Combustível:</strong> {veiculo.combustivel || '—'}</p>

        <p>
          <strong>Última Inspeção:</strong> {formatarData(veiculo.ultimaInspecao)}
          {estadoInspecao === 'expirada' && (
            <span className="aviso-vermelho"> ⚠️ Expirada</span>
          )}
          {estadoInspecao && estadoInspecao.startsWith('Faltam') && (
            <span className="aviso-amarelo"> ⚠️ {estadoInspecao}</span>
          )}
        </p>

        <p>
          <strong>Seguro até:</strong> {formatarData(veiculo.seguroAte)}
          {isSeguroExpirado(veiculo.seguroAte) && (
            <span className="aviso-vermelho"> ⚠️ Expirado</span>
          )}
          {!isSeguroExpirado(veiculo.seguroAte) && isSeguroPertoDoFim(veiculo.seguroAte) && (
            <span className="aviso-amarelo"> ⚠️ A expirar</span>
          )}
        </p>

        <button className="botao-editar" onClick={() => setMostrarModal(true)}>Editar</button>
      </div>

      {mostrarModal && (
        <EditarVeiculo
          veiculo={veiculo}
          onFechar={() => setMostrarModal(false)}
          onAtualizar={onAtualizar}
        />
      )}
    </>
  );
}



