import { useState, useEffect } from 'react'
import './Home.css'
import Footer from '../../components/footer/Footer.jsx'

const images = [
  '/images/Home/imagem1.jpg',
  '/images/Home/imagem2.jpg',
  '/images/Home/imagem3.jpg'
]

function Home() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, {
      threshold: 0.2
    });

    const elements = document.querySelectorAll('.scroll-fade-up')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="home-wrapper">
        <div className="background-section"></div>

        <div className="content-section">
          <div className="slideshow scroll-fade-up">
            <img
              src={images[currentImage]}
              alt="hero"
              className="slideshow-image"
            />
            <div className="slideshow-overlay">
              <h1 className="scroll-fade-up">Bem-vindo</h1>
              <p className="scroll-fade-up">Domine as suas finanças com estilo e inteligência.</p>
              <button className="scroll-fade-up" onClick={() => (window.location.href = '/login')}>Entrar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
  <div className="cards-wrapper">
    <div className="feature">
      <img src="/images/Home/despesas.jpg" alt="Gestão de Despesas" />
      <h3>Gestão de Despesas</h3>
      <p>Controla todos os teus gastos com simplicidade e clareza.</p>
      <p>Cria categorias, analisa tendências e evita surpresas no final do mês.</p>
    </div>

    <div className="feature">
      <img src="/images/Home/previsoes.jpg" alt="Previsões Financeiras" />
      <h3>Previsões Financeiras</h3>
      <p>Antecipação de movimentos com base no teu histórico financeiro.</p>
      <p>Visualiza cenários futuros e planeia com mais confiança.</p>
    </div>

    <div className="feature">
      <img src="/images/Home/relatorios.jpg" alt="Relatórios Inteligentes" />
      <h3>Relatórios Inteligentes</h3>
      <p>Exporta relatórios e analisa dados de forma profissional.</p>
      <p>Ideal para freelancers, empresas ou uso pessoal detalhado.</p>
    </div>
  </div>

  <div className="features-button-container">
    <button onClick={() => window.location.href = '/sobre'}>
      Saber mais!
    </button>
  </div>
</div>
    <>
      {/* Conteúdo da página */}
      <Footer />
    </>
    
    </>
  )
}

export default Home


  