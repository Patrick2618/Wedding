import React from 'react'
import { Heart, MapPin, Clock, Phone, Mail } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const goToBoletos = () => {
    if (location.pathname !== "/inicio") {
      navigate("/inicio#boletoss");
    } else {
      const el = document.getElementById("boletoss");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-secondary border-t border-primary/20 footeer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y información principal */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-full">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-text-primary">
                  Damaris & Jose Luis
                </h3>
                <p className="text-sm text-text-secondary">
                  29 de Noviembre, 2025
                </p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Nos complace invitarte a celebrar nuestro día especial. 
              Tu presencia hará que este momento sea aún más memorable.
            </p>
          </div>
          
          {/* Información del evento */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Información del Evento
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-text-secondary text-sm">
                  “La Macarena”, Zapopan
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-text-secondary text-sm">
                  19:00 - 02:00
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-text-secondary text-sm">
                  +52 33 1279 2189
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-text-secondary text-sm">
                  boda@d&jl.com
                </span>
              </div>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-lg font-semibold text-text-primary mb-4">
              Enlaces Rápidos
            </h4>
            <div className="space-y-2">
              <Link
                to="/inicio"
                className="block text-text-secondary hover:text-primary transition-colors text-sm"
              >
                Inicio
              </Link>
              <Link
                to="/informacion"
                className="block text-text-secondary hover:text-primary transition-colors text-sm"
              >
                Información del Evento
              </Link>
              <Link
                to="/inicio#boletoss"
                className="block text-text-secondary hover:text-primary transition-colors text-sm"
              >
                Confirmar Asistencia
              </Link>
              <a
                href='https://maps.app.goo.gl/L7UTK74nFgkUQggP6'
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text-secondary hover:text-primary transition-colors text-sm"
              >
                Cómo Llegar
              </a>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria y copyright */}
        <div className="border-t border-primary/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-text-secondary text-sm">
              © 2025 Damariz & Jose Luis. Hecho con ❤️ por CaniByte.
            </p>
            <p className="text-text-secondary text-xs">
              Por favor, confirma tu asistencia antes del 1 de Octubre.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer