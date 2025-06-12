import React from 'react';
import './SelecaoServicos.css';
import amazonPrime from '../../../../assets/Servicos/amazonprime.svg';
import applemusic from '../../../../assets/Servicos/applemusic.svg';
import appletv from '../../../../assets/Servicos/appletv.svg';
import disney from '../../../../assets/Servicos/disney.svg';
import hbomax from '../../../../assets/Servicos/hbomax.svg';
import icloud from '../../../../assets/Servicos/icloud.svg';
import netflix from '../../../../assets/Servicos/netflix.svg';
import playstation from '../../../../assets/Servicos/playstation.svg';
import spotify from '../../../../assets/Servicos/spotify.svg';
import youtube from '../../../../assets/Servicos/youtube.svg';

const servicos = [
  {
    nome: "Spotify Premium",
    valor: 6.99,
    diaRenovacao: 10,
    icone: spotify,
  },
  {
    nome: "Netflix",
    valor: 7.99,
    diaRenovacao: 15,
    icone: netflix,
  },
  {
    nome: "iCloud 200GB",
    valor: 2.99,
    diaRenovacao: 1,
    icone: icloud,
  },
  {
    nome: "YouTube Premium",
    valor: 8.49,
    diaRenovacao: 20,
    icone: youtube,
  },
  {
    nome: "Disney+",
    valor: 8.99,
    diaRenovacao: 5,
    icone: disney,
  },
  {
    nome: "Apple TV+",
    valor: 6.99,
    diaRenovacao: 17,
    icone: appletv,
  },
  {
    nome: "Apple Music",
    valor: 6.99,
    diaRenovacao: 4,
    icone: applemusic,
  },
  {
    nome: "Amazon Prime Video",
    valor: 4.99,
    diaRenovacao: 12,
    icone: amazonPrime,
  },
  {
    nome: "HBO Max",
    valor: 9.99,
    diaRenovacao: 8,
    icone: hbomax,
  },
  {
    nome: "PlayStation Plus",
    valor: 8.99,
    diaRenovacao: 22,
    icone: playstation,
  },
];

export default function SelecaoServicos({ onAdicionar, onFechar }) {
  return (
    <div className="selecao-servicos-backdrop">
      <div className="selecao-servicos-modal">
        <h2>Seleciona uma subscrição</h2>
        <div className="grid-servicos">
          {servicos.map(servico => (
            <div key={servico.nome} className="servico-card">
              <img src={servico.icone} alt={servico.nome} />
              <h4>{servico.nome}</h4>
              <p>{servico.valor.toFixed(2)} € / mês</p>
              <button onClick={() => onAdicionar(servico)}>Adicionar</button>
            </div>
          ))}
        </div>
        <button className="btn-fechar" onClick={onFechar}>Fechar</button>
      </div>
    </div>
  );
}
