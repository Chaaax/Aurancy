const API_URL = 'http://localhost:3000/api/auth';


export async function registar(dados) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erro ao registar');
  }

  return data;
}


export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    // Se o status não for 200, lança o erro com mensagem do backend
    throw new Error(data.error || 'Erro no login');
  }

  return data;
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await res.json();
}