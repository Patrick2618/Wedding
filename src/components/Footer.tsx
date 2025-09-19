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
    <footer className="bg-[#fdfcf9] border-t border-gray-300 foooter">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          
          {/* Información principal */}
          <div className="md:w-1/3 text-center md:text-left">
            <h3 className="text-2xl font-[Times New Roman] text-[#111] mb-2">
              Damariz & José Luis
            </h3>
            <p className="text-sm text-gray-600 mb-2 font-[Times New Roman] uppercase tracking-wide">
              29 de Noviembre, 2025
            </p>
            <p className="text-sm text-gray-600 font-[Times New Roman] leading-relaxed">
              Nos complace invitarte a celebrar nuestro día especial. Tu presencia hará que este momento sea aún más memorable.
            </p>
          </div>

          {/* Información del evento */}
          <div className="md:w-1/3 text-center md:text-left space-y-2 text-gray-600 font-[Times New Roman] text-sm">
            <p>📍 La Macarena, Zapopan</p>
            <p>⏰ 19:00 - 02:00</p>
            <p>📞 +52 33 1279 2189</p>
            <p>✉️ damarizyjoseluis.com</p>
          </div>

          {/* Enlaces rápidos */}
          <div className="md:w-1/3 text-center md:text-left space-y-2 text-gray-600 font-[Times New Roman] text-sm">
            <Link
              to="/inicio"
              className="block hover:text-gray-900 transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/informacion"
              className="block hover:text-gray-900 transition-colors"
            >
              Información
            </Link>
            <Link
              to="/inicio#boletoss"
              className="block hover:text-gray-900 transition-colors"
            >
              Confirmar Asistencia
            </Link>
            <a
              href="https://maps.app.goo.gl/L7UTK74nFgkUQggP6"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-gray-900 transition-colors"
            >
              Cómo Llegar
            </a>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-300 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-600 text-sm font-[Times New Roman]">
              © 2025 Damariz & José Luis. Hecho con ❤️ por CaniByte.
            </p>
            <p className="text-gray-600 text-xs font-[Times New Roman]">
              Por favor, confirma tu asistencia antes del 16 de Noviembre.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer