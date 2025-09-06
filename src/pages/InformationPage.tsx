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
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
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
                    <p className="font-semibold text-text-primary">
                      29 de Noviembre 2025
                    </p>
                    <p className="text-text-secondary text-sm">
                      Sábado
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      Ceremonia: 18:00
                    </p>
                    <p className="text-text-secondary text-sm">
                      Recepción: 19:00
                    </p>
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
                  <h3 className="font-semibold text-text-primary mb-2">Ceremonia</h3>
                  <p className="text-text-secondary mb-2">
                    Benito Juárez 5581, <br>
                    </br>Sta. María del Pueblito, <br>
                    </br>45018 Zapopan, Jal.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://maps.app.goo.gl/L7UTK74nFgkUQggP6', '_blank')}
                  >
                    Ver en Maps
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Recepción</h3>
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
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Código de Vestimenta
              </h2>
              
              <div className="space-y-3">
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Formal Elegante</h3>
                  <p className="text-text-secondary text-sm">
                    Trajes y vestidos elegantes. Evitar colores blanco y marfil.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-elegant p-6">
                  <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                    {/* Código de Vestimenta */}
                  </h2>

                  <div className="space-y-3">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h3 className="font-semibold text-text-primary mb-2">Etiqueta y Colores</h3>
                      <p className="text-text-secondary text-sm">
                        Para <span className="font-medium">invitadas</span>: por favor <span className="font-medium">evitar vestidos en tonos blanco, perla o hueso</span>. ¡Gracias por respetar a la novia!
                      </p>
                    </div>
                  </div>
                </div>
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
                
                {/* <div className="bg-accent/10 rounded-lg p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Lluvia de Sobres</h3>
                  <p className="text-text-secondary text-sm">
                    También habrá una lluvia de sobres durante la recepción
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          
          {/* Services & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Parking */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                Estacionamiento
              </h3>
              <p className="text-text-secondary text-sm">
                Estacionamiento gratuito disponible en ambas ubicaciones. Servicio de valet en la recepción.
              </p>
            </div>
            
            {/* Photography */}
            {/* <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                Fotografía
              </h3>
              <p className="text-text-secondary text-sm">
                Ceremonia sin flash. Habrá fotógrafo profesional. ¡Comparte tus fotos con #D&JL2025!
              </p>
            </div> */}
            
            {/* Music */}
            {/* <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                Música
              </h3>
              <p className="text-text-secondary text-sm">
                DJ profesional y pista de baile. ¡Prepárate para bailar toda la noche!
              </p>
            </div> */}
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
      href="mailto:boda@d&jl.com"
      className="inline-flex items-center rounded-lg border border-border px-3 py-2 hover:bg-primary/5 transition"
    >
      <Mail className="h-4 w-4 text-primary mr-2" />
      <span className="text-text-secondary text-sm">boda@d&jl.com</span>
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