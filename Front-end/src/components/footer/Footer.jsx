import './Footer.css'
import logo from './imagens/aurancy-logo.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { useState } from 'react'

const frases = [
  'Aurancy é onde o teu futuro financeiro começa a tomar forma.',
  'Tecnologia com propósito. Resultados com visão.',
  'Claridade, controlo e confiança. Tudo começa com Aurancy.',
  'Futuro financeiro com alma tecnológica.',
  'Confia no teu instinto. Aurancy cuida do resto.'
]

function Footer() {
  const [hovered, setHovered] = useState(false)

  return (
    <footer className={`footer ${hovered ? 'footer-glow' : ''}`}>
      <div className="footer-top">
      <Swiper
            modules={[EffectFade, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }} 
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            >
            {frases.map((frase, index) => (
                <SwiperSlide key={index}>
                <p className="footer-quote">{frase}</p>
                </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <div className="footer-contact">
        <div
          className="logo-wrapper"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={logo} alt="Aurancy Logo" className="footer-logo" />
        </div>
        <div>
          <p><strong>Contato:</strong> financil@app.com</p>
          <p><strong>WhatsApp:</strong> +351 912 345 678</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} – Aurancy. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer