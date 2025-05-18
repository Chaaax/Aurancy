import React, { useEffect, useState } from 'react'
import './Perfil.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'

function Perfil() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Falha ao obter utilizador.')

        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error('Erro ao obter dados do perfil:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <>
        <Topbar />
        <div className="perfil-wrapper">
          <Sidebar />
          <div className="perfil-loading">A carregar perfil...</div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Topbar />
        <div className="perfil-wrapper">
          <Sidebar />
          <div className="perfil-erro">Erro ao carregar utilizador.</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar />
      <div className="perfil-wrapper">
        <Sidebar />
        <div className="perfil-card">
          <div className="perfil-header">
            <img
              src="/images/profile-default.png"
              alt="Foto de perfil"
              className="perfil-foto"
            />
            <h2>{user.fullName}</h2>
          </div>
          <div className="perfil-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Data de nascimento:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
            <p><strong>País:</strong> {user.country}</p>
            <p><strong>Telefone:</strong> {user.phone}</p>
            <p><strong>Moeda:</strong> {user.currency || '—'}</p>
            <p><strong>Perfil Financeiro:</strong> {user.profile || '—'}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Perfil
