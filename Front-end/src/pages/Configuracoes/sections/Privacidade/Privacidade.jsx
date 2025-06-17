import { useState, useEffect } from 'react';
import { FaLock } from 'react-icons/fa';
import './Privacidade.css';

const Privacidade = () => {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [sharingConsent, setSharingConsent] = useState(false);

  // Carregar valores do localStorage ao iniciar
  useEffect(() => {
    const storedAnalytics = localStorage.getItem('analyticsConsent');
    const storedSharing = localStorage.getItem('sharingConsent');

    if (storedAnalytics === 'true') setAnalyticsConsent(true);
    if (storedSharing === 'true') setSharingConsent(true);
  }, []);

  // Atualizar localStorage ao marcar
  const handleCheck = (setter, key, value) => {
    if (!value) {
      setter(true);
      localStorage.setItem(key, 'true');
    }
  };

  return (
    <div className="privacidade-container">
      <h2 className="titulo-priv">
        <FaLock className="icone-lock" /> Privacidade
      </h2>

      <p className="descricao">
        Na <strong>Aurancy</strong>, a tua privacidade está no centro de tudo o que fazemos.
        Recolhemos apenas os dados necessários para te proporcionar uma melhor experiência de gestão financeira,
        sempre com total transparência e controlo do teu lado.
      </p>

      <h3 className="subtitulo-priv">Preferências de Dados</h3>
      <div className="opcoes-checkbox">
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={analyticsConsent}
            onChange={() => handleCheck(setAnalyticsConsent, 'analyticsConsent', analyticsConsent)}
          />
          Permitir análises personalizadas com base nas minhas despesas
        </label>
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={sharingConsent}
            onChange={() => handleCheck(setSharingConsent, 'sharingConsent', sharingConsent)}
          />
          Partilhar dados de forma anónima para melhorar a plataforma
        </label>
      </div>

      <h3 className="subtitulo-priv">Localização e Dados Técnicos</h3>
      <p className="descricao">
        Poderemos recolher dados gerais como região, tipo de dispositivo ou sistema operativo para garantir
        que a plataforma funciona corretamente e de forma segura. Estes dados são anónimos e usados apenas
        para otimização da experiência.
      </p>

      <h3 className="subtitulo-priv">Os teus direitos</h3>
      <p className="descricao">
        Tens total controlo sobre os teus dados. Podes consultar, atualizar ou eliminar informações pessoais
        a qualquer momento através das definições da tua conta.
      </p>

      <h3 className="subtitulo-priv">Compromisso com a Segurança</h3>
      <p className="descricao">
        Todos os dados são armazenados com encriptação avançada. Nunca partilhamos informações com terceiros sem
        o teu consentimento explícito. A tua confiança é a nossa prioridade.
      </p>

      <a href="#" className="link-politica">
        Ver política de privacidade completa
      </a>
    </div>
  );
};

export default Privacidade;




