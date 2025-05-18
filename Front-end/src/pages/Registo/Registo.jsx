import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registar, login as loginAPI } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import './Registo.css';

function Registo() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthDate: '',
    country: '',
    phone: '',
    profile: '',
    currency: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert('As palavras-passe não coincidem!');
    }

    try {
      await registar(form);
      const resposta = await loginAPI(form.email, form.password);
      login(resposta.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'Erro ao registar.');
    }
  };

  return (
    <div className="registo-page-wrapper">
      <div className="registo-container">
        <h2 className="registo-title">Cria a tua conta na Aundancy</h2>
        <form onSubmit={handleSubmit} className="registo-form">
          <input name="fullName" type="text" placeholder="Nome completo" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirmar password" onChange={handleChange} required />

          <div className="registo-row">
            <input name="birthDate" type="date" onChange={handleChange} required />
            <input name="country" type="text" placeholder="País" onChange={handleChange} required />
          </div>

          <div className="registo-row">
            <input name="phone" type="tel" placeholder="Telemóvel" onChange={handleChange} required />
            <select name="currency" onChange={handleChange} required>
              <option value="">Moeda preferida</option>
              <option value="EUR">Euro €</option>
              <option value="USD">Dólar $</option>
              <option value="GBP">Libra £</option>
              <option value="BRL">Real R$</option>
            </select>
          </div>

          <select name="profile" onChange={handleChange} required>
            <option value="">Perfil financeiro</option>
            <option value="student">Estudante</option>
            <option value="professional">Profissional</option>
            <option value="investor">Investidor</option>
            <option value="retired">Reformado</option>
            <option value="retired">Outro</option>
          </select>

          <div className="registo-checkbox">
            <input type="checkbox" id="termos" required />
            <label htmlFor="termos">
              Aceito os <a href="#">termos e condições</a>
            </label>
          </div>


          <button type="submit" className="registo-btn">Registar</button>
        </form>
      </div>
    </div>
  );
}

export default Registo;