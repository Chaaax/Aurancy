import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import ParticlesBackground from '../../components/ParticlesBackground'; // importa fundo
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await loginAPI(email, password);
      const token = resposta.token;

      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao obter dados do utilizador.');
      }

      const user = await res.json();

      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <ParticlesBackground />
      <div className="auth-container">
        <h2>Entrar na tua conta</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;





