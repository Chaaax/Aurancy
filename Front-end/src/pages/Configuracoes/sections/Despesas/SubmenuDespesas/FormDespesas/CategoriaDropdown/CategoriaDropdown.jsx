import { useState } from 'react'
import './CategoriaDropdown.css'

const categorias = [
  {
    nome: 'Habitação',
    cor: '#fbbf24',
    icon: '🏠',
    subcategorias: [
      'Renda',
      'Hipoteca',
      'Energia',
      'Água',
      'Condomínio',
      'Seguro de habitação',
      'Manutenção e reparações',
      'Limpeza',
      'Alarme / Segurança'
    ]
  },
  {
    nome: 'Transporte',
    cor: '#60a5fa',
    icon: '🚗',
    subcategorias: ['Combustível', 'Passe', 'Reparações', 'Seguro automóvel']
  },
  {
    nome: 'Comunicação e Informática',
    cor: '#a78bfa',
    icon: '📱',
    subcategorias: ['Internet', 'Telemóvel', 'TV por cabo', 'Subscrições digitais']
  },
  {
    nome: 'Alimentação',
    cor: '#ef4444',
    icon: '🍽️',
    subcategorias: ['Supermercado', 'Refeições fora']
  },
  {
    nome: 'Impostos',
    cor: '#f87171',
    icon: '🧾',
    subcategorias: [
      'IMI',
      'IRS',
      'IRC',
      'IUC',
      'Segurança Social',
      'Taxas municipais',
      'Multas e coimas'
    ]
  },
  {
    nome: 'Saúde',
    cor: '#34d399',
    icon: '💊',
    subcategorias: [
      'Seguro de saúde',
      'Consultas',
      'Medicação',
      'Exames clínicos',
      'Ginásio'
    ]
  },
  {
    nome: 'Educação',
    cor: '#f472b6',
    icon: '🎓',
    subcategorias: [
      'Mensalidade escolar',
      'Material escolar',
      'Cursos online',
      'Propinas'
    ]
  },
  {
    nome: 'Lazer e Subscrições',
    cor: '#fb923c',
    icon: '🎮',
    subcategorias: [
      'Netflix',
      'Spotify',
      'Amazon Prime',
      'Disney+',
      'Cinema',
      'Eventos'
    ]
  },
  {
    nome: 'Pessoais e Compras',
    cor: '#c084fc',
    icon: '🛍️',
    subcategorias: [
      'Vestuário',
      'Beleza',
      'Higiene',
      'Presentes',
      'Compras gerais'
    ]
  },
  {
    nome: 'Outros',
    cor: '#9ca3af',
    icon: '📦',
    subcategorias: [
      'Despesas diversas',
      'Não categorizadas',
      'Extras'
    ]
  }
]

export default function CategoriaDropdown({ onSelect }) {
  const [aberta, setAberta] = useState(false)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)
  const [categoriaExpandida, setCategoriaExpandida] = useState(null)

  const handleSubcategoriaClick = (sub) => {
    setCategoriaSelecionada(sub)
    setAberta(false)
    if (onSelect) onSelect(sub)
  }

  const toggleCategoria = (nome) => {
    setCategoriaExpandida((prev) => (prev === nome ? null : nome))
  }

  return (
    <div className="categoria-dropdown">
      <div
        className="dropdown-toggle"
        onClick={() => setAberta((prev) => !prev)}
      >
        {categoriaSelecionada || 'Selecionar categoria'}
        <span className="seta">▾</span>
      </div>

      {aberta && (
        <div className="dropdown-menu">
          {categorias.map((cat) => (
            <div key={cat.nome} className="categoria-item">
              <div
                className="categoria-header"
                style={{ color: cat.cor, cursor: 'pointer' }}
                onClick={() => toggleCategoria(cat.nome)}
              >
                <span className="icon" style={{ color: cat.cor }}>{cat.icon}</span>
                {cat.nome}
              </div>
              {categoriaExpandida === cat.nome && (
                <ul>
                  {cat.subcategorias.map((sub) => (
                    <li key={sub} onClick={() => handleSubcategoriaClick(sub)}>
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

