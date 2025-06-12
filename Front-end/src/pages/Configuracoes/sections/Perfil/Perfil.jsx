import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Falha ao obter utilizador.');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Erro ao obter dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/auth/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao fazer upload da imagem.');

      const meRes = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUser = await meRes.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-PT');

  const InfoLine = ({ label, value }) => (
    <p className="perfil-info-line">
      <span className="perfil-label">{label}</span>
      <span>{value || '—'}</span>
    </p>
  );

  const Content = () => (
    <div className="perfil-card">
      <div className="perfil-header">
        <div className="perfil-foto-wrapper">
          <img
            src={user.profilePictureUrl || '/images/profile-default.png'}
            alt="Foto de perfil"
            className="perfil-foto"
          />
          <label className="perfil-upload-overlay">
            📷
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        </div>
        <div className="perfil-info-main">
          <h2 className="perfil-nome">{user.fullName}</h2>
          <p className="perfil-email">{user.email}</p>
          {user.premium && <div className="badge-premium">✨ Aurancy Premium Ativo</div>}
          <button className="perfil-edit-btn">Editar perfil</button>
        </div>
      </div>

      <div className="perfil-info">
        <InfoLine label="Data de nascimento:" value={formatDate(user.birthDate)} />
        <InfoLine label="País:" value={user.country} />
        <InfoLine label="Telefone:" value={user.phone} />
        <InfoLine label="Moeda:" value={user.currency} />
        <InfoLine label="Perfil Financeiro:" value={user.profile} />

        {/* Bloco Aurancy Premium */}
        <div className="perfil-info-line" style={{ marginTop: '30px' }}>
          <span className="perfil-label">Estado Premium:</span>
          <span style={{ color: user.premium ? '#4caf50' : '#f39c12' }}>
            {user.premium ? 'Ativo ✨' : 'Gratuito'}
          </span>
        </div>
        {!user.premium && (
          <button
            className="perfil-edit-btn"
            style={{ backgroundColor: '#9b59b6', marginTop: '10px' }}
            onClick={() => navigate('/premium')}
          >
            Ativar Aurancy Premium ✨
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <div className="perfil-loading">A carregar perfil...</div>
      ) : user ? (
        <Content />
      ) : (
        <div className="perfil-erro">Erro ao carregar utilizador.</div>
      )}
    </>
  );
}

export default Perfil;


