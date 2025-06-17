import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao fazer upload da imagem.');

      const updated = await fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = await updated.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosEdicao((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosEdicao),
      });

      if (!res.ok) throw new Error('Erro ao guardar alterações');
      const atualizado = await res.json();
      setUser(atualizado);
      setModoEdicao(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar alterações.');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-PT');

  const renderInfoLine = (label, value) => (
    <p className="perfil-info-line">
      <span className="perfil-label">{label}</span>
      <span>{value || '—'}</span>
    </p>
  );

  if (loading) return <div className="perfil-loading">A carregar perfil...</div>;
  if (!user) return <div className="perfil-erro">Erro ao carregar utilizador.</div>;

  return (
    <div className="perfil-card">
      <div className="perfil-header">
        <div className="perfil-foto-wrapper">
          <img
            src={user.profilePicture || '/images/profile-default.png'}
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
          {modoEdicao ? (
            <button className="perfil-edit-btn" onClick={handleGuardar}>Guardar alterações</button>
          ) : (
            <button
              className="perfil-edit-btn"
              onClick={() => {
                setModoEdicao(true);
                setDadosEdicao({
                  fullName: user.fullName || '',
                  phone: user.phone || '',
                  country: user.country || '',
                  currency: user.currency || '',
                });
              }}
            >
              Editar perfil
            </button>
          )}
        </div>
      </div>

      <div className="perfil-info">
        {modoEdicao ? (
          <>
            <label className="perfil-label">Nome:</label>
            <input
              name="fullName"
              value={dadosEdicao.fullName}
              onChange={handleInputChange}
              className="perfil-input"
            />

            <label className="perfil-label">Telefone:</label>
            <input
              name="phone"
              value={dadosEdicao.phone}
              onChange={handleInputChange}
              className="perfil-input"
            />

            <label className="perfil-label">País:</label>
            <input
              name="country"
              value={dadosEdicao.country}
              onChange={handleInputChange}
              className="perfil-input"
            />

            <label className="perfil-label">Moeda:</label>
            <input
              name="currency"
              value={dadosEdicao.currency}
              onChange={handleInputChange}
              className="perfil-input"
            />
          </>
        ) : (
          <>
            {renderInfoLine("Data de nascimento:", formatDate(user.birthDate))}
            {renderInfoLine("País:", user.country)}
            {renderInfoLine("Telefone:", user.phone)}
            {renderInfoLine("Moeda:", user.currency)}
            {renderInfoLine("Perfil Financeiro:", user.profile)}
          </>
        )}

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
}

export default Perfil;
