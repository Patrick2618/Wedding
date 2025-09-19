import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Heart, 
  Camera, 
  Gift, 
  Music, 
  Utensils,
  Car,
  Phone,
  Mail,
  ArrowLeft,
  Users
} from 'lucide-react'
import Button from '../components/Button'
import { formatDate, formatTime } from '../lib/utils'
import { useInvitado } from "../components/InvitadoContext";


const InformationPage: React.FC = () => {
  
  const navigate = useNavigate()
  const [comentarios, setComentarios] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [okComentario, setOkComentario] = useState(null);
  const [errComentario, setErrComentario] = useState(null);
  const { invitado } = useInvitado();
  
  
  // === Función para enviar comentarios ===
  const enviarComentarios = async () => {
    try {
      setEnviando(true);
      setOkComentario(null);
      setErrComentario(null);
  
      // Simulación de envío al backend (ajusta con tu endpoint real)
      const resp = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario: comentarios, invitado: invitado.id }),
      });
  
      if (!resp.ok) throw new Error("Error al enviar comentario");
  
      setOkComentario("¡Comentario enviado con éxito!");
      setComentarios(""); // limpiar textarea
    } catch (error) {
      setErrComentario(error.message || "No se pudo enviar el comentario.");
    } finally {
      setEnviando(false);
    }
  };
  
  
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="font-heading text-3xl font-semibold text-text-primary mb-2">
                Información del Evento
              </h1>
              <p className="text-text-secondary">
                Todo lo que necesitas saber sobre nuestra boda
              </p>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Fecha y Hora
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary textt">
                      29 de Noviembre 2025
                    </p>
                    <p className="text-text-secondary text-m textt">
                      Sábado
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary textt">
                      Ceremonia Civil: 18:00
                    </p>
                    <p className="text-text-secondary text-m textt">
                      Recepción: 19:00
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-container">
                      <div className="space-y-3">
                        <div className="bg-primary/10 rounded-lg p-4">
                          <h3 className="font-semibold text-text-primary mb-2">Riguroso Formal</h3>
                          <p className="text-m text-gray-700">
                            Se recomienda traje oscuro para caballeros y vestido largo o elegante para damas. <b>Evitar colores blanco y marfil.</b>
                          </p>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Ubicación
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Ceremonia Civil</h4>
                  <p className="text-text-secondary mb-2">
                    Benito Juárez 5581, <br>
                    </br>Sta. María del Pueblito, <br>
                    </br>45018 Zapopan, Jal.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className='buton-maps'
                    onClick={() => window.open('https://maps.app.goo.gl/L7UTK74nFgkUQggP6', '_blank')}
                  >
                    Ver en Maps
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Recepción</h4>
                  <p className="text-text-secondary mb-2">
                    Av. Ignacio L Vallarta 6112, <br>
                    </br>Jocotán, <br>
                    </br>45017 Zapopan, Jal
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://maps.app.goo.gl/KqRo6NA7E7cqA3Pr5', '_blank')}
                  >
                    Ver en Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Dress Code */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div className='bg-primary/5 parkin-container'>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  Estacionamiento
                </h3>
                <p className="text-text-secondary text-sm mb-2">
                  Estacionamiento gratuito disponible en ambas ubicaciones.
                </p>
                <p className="text-sm font-semibold text-primary">
                  Servicio de <span className="underline">Valet Parking</span> en la recepción
                </p>
              </div>
              
            </div>
            
            {/* Gifts */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-primary" />
                Regalos
              </h2>
              
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Mesa de Regalos</h3>
                  <p className="text-text-secondary text-sm mb-3">
                    Liverpool y Palacio de Hierro
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Liverpool:</span> #51700032
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Mesa de regalos Amazon: “Damariz Brenez y José Luis Nieto”</span>
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
          {/* Services & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 food-container">
            {/* Opciones de comida */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="font-heading text-xl md:text-2xl font-semibold mb-6 text-[#2b2b2b] text-center">
                Opciones de menú
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pescado */}
                <div className="opcion-menu">
                  <div className="text-4xl mb-4">🐟</div>
                  <h5 className="titulo-menu">Pescado</h5>
                  <p className="descripcion-menu">
                    Filete fresco acompañado de guarnición delicada.
                  </p>
                </div>

                {/* Carne */}
                <div className="opcion-menu">
                  <div className="text-4xl mb-4">🥩</div>
                  <h5 className="titulo-menu">Carne</h5>
                  <p className="descripcion-menu">
                    Corte premium en salsa, con acompañamientos selectos.
                  </p>
                </div>

                </div>
            </div>

            {/* Información importante - ocupa las 3 columnas */}
            <div className="col-span-1 md:col-span-3 boletos-sub rounded-2xl p-5 md:p-6 backdrop-blur mt-6 text-black">
              <h4 className="font-heading text-lg md:text-xl font-semibold mb-4 text-[#2b2b2b]">
                Información importante
              </h4>
              <p className="text-sm opacity-90 mb-3">
                Si tienes alguna alergia, restricción alimenticia o comentario que deban
                saber los anfitriones, por favor escríbelo aquí:
              </p>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-[#2b2b2b]/30 bg-white/60 text-[#2b2b2b] p-3 text-sm placeholder-[#2b2b2b]/50 focus:outline-none focus:ring-2 focus:ring-[#2b2b2b]/40"
                placeholder="Escribe aquí tus comentarios..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              ></textarea>

              <div className="mt-4 text-center">
                <button
                  onClick={enviarComentarios}
                  disabled={enviando}
                  className="inline-flex items-center justify-center rounded-xl bg-[rgb(253_252_249_/_0.9)] text-[#2b2b2b] hover:bg-white px-5 py-3 text-sm font-medium shadow-elegant disabled:opacity-70"
                >
                  {enviando ? "Enviando…" : "Enviar información"}
                </button>
              </div>
            </div>
          </div>


          
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-elegant p-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
              Contacto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preguntas generales */}
              <div className="bg-white rounded-xl shadow-elegant p-5">
                <h3 className="font-semibold text-text-primary mb-2">¿Dudas o necesitas ayuda?</h3>
                <p className="text-text-secondary text-sm mb-3">
                  Escríbenos y con gusto te apoyamos con cualquier detalle.
                </p>

                <a
                  href="mailto:damariz&joseluis.com"
                  className="inline-flex items-center rounded-lg border border-border px-3 py-2 hover:bg-primary/5 transition"
                >
                  <Mail className="h-4 w-4 text-primary mr-2" />
                  <span className="text-text-secondary text-sm">damariz&joseluis.com</span>
                </a>
              </div>

              {/* Coordinación del evento */}
              <div className="bg-white rounded-xl shadow-elegant p-5">
                <h3 className="font-semibold text-text-primary mb-2">Coordinación del Evento</h3>
                <p className="text-text-primary text-sm font-medium mb-2">Niza Arellano</p>

                <a
                  href="tel:+523312792189"
                  className="inline-flex items-center rounded-lg border border-border px-3 py-2 hover:bg-primary/5 transition"
                >
                  <Phone className="h-4 w-4 text-primary mr-2" />
                  <span className="text-text-secondary text-sm">+52 33 1279 2189</span>
                </a>

                <p className="text-xs text-text-secondary mt-3">
                  Horario de atención: 10:00–18:00 (GMT-6)
                </p>
              </div>
            </div>
          </div>
                    
        </div>
      </div>
    </div>
  )
}

export default InformationPage