import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Check, 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Mail, 
  Phone,
  Share2,
  Download,
  Home
} from 'lucide-react'
import Button from '../components/Button'
import { useConfirmation } from '../hooks/useConfirmation'
import { formatDate, formatTime } from '../lib/utils'
import type { Guest } from '../lib/supabase'

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate()
  const { getConfirmation } = useConfirmation()
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null)
  const [confirmation, setConfirmation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const weddingDate = new Date('2024-06-15T16:00:00')
  const ceremonyTime = new Date('2024-06-15T16:00:00')
  const receptionTime = new Date('2024-06-15T18:30:00')
  
  useEffect(() => {
    const loadConfirmation = async () => {
      const guestData = sessionStorage.getItem('currentGuest')
      if (!guestData) {
        navigate('/')
        return
      }
      
      const guest = JSON.parse(guestData) as Guest
      setCurrentGuest(guest)
      
      const confirmationData = await getConfirmation(guest.id)
      setConfirmation(confirmationData)
      setLoading(false)
    }
    
    loadConfirmation()
  }, [])
  
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Boda de María & Juan',
          text: '¡Estás invitado a nuestra boda!',
          url: window.location.origin
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin)
      alert('Enlace copiado al portapapeles')
    }
  }
  
  const downloadCalendarEvent = () => {
    const event = {
      title: 'Boda de María & Juan',
      start: weddingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: new Date(weddingDate.getTime() + 6 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: 'Ceremonia religiosa y recepción',
      location: 'Iglesia San José, Calle Principal 123'
    }
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//Wedding Event//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@wedding.com`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'boda-maria-juan.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light to-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando confirmación...</p>
        </div>
      </div>
    )
  }
  
  if (!currentGuest || !confirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light to-secondary">
        <div className="bg-white rounded-xl shadow-elegant p-8 max-w-md w-full mx-4 text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-2">
            Confirmación no encontrada
          </h2>
          <p className="text-text-secondary mb-4">
            No pudimos encontrar tu confirmación. Por favor, intenta nuevamente.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-xl shadow-elegant p-8 mb-6 text-center">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="font-heading text-3xl font-semibold text-text-primary mb-2">
              {confirmation.attending ? '¡Confirmación Exitosa!' : 'Confirmación Recibida'}
            </h1>
            
            <p className="text-text-secondary text-lg">
              {confirmation.attending 
                ? `¡Gracias ${currentGuest.first_name}! Nos emociona celebrar contigo.`
                : `Gracias ${currentGuest.first_name} por informarnos. Te extrañaremos.`
              }
            </p>
          </div>
          
          {/* Confirmation Details */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
              Detalles de tu confirmación
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-text-secondary">Invitado:</span>
                <span className="font-medium text-text-primary">
                  {currentGuest.first_name} {currentGuest.last_name}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-text-secondary">Estado:</span>
                <span className={`font-medium ${
                  confirmation.attending ? 'text-green-600' : 'text-red-600'
                }`}>
                  {confirmation.attending ? 'Asistiré' : 'No podré asistir'}
                </span>
              </div>
              
              {confirmation.attending && (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-text-secondary">Acompañantes:</span>
                    <span className="font-medium text-text-primary">
                      {confirmation.plus_ones?.length || 0}
                    </span>
                  </div>
                  
                  {confirmation.plus_ones && confirmation.plus_ones.length > 0 && (
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-text-secondary block mb-2">Nombres de acompañantes:</span>
                      <ul className="space-y-1">
                        {confirmation.plus_ones.map((plusOne: any, index: number) => (
                          <li key={index} className="text-text-primary font-medium">
                            • {plusOne.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {confirmation.dietary_restrictions && (
                    <div className="py-2 border-b border-gray-100">
                      <span className="text-text-secondary block mb-1">Restricciones dietéticas:</span>
                      <p className="text-text-primary">{confirmation.dietary_restrictions}</p>
                    </div>
                  )}
                  
                  {confirmation.special_requests && (
                    <div className="py-2">
                      <span className="text-text-secondary block mb-1">Solicitudes especiales:</span>
                      <p className="text-text-primary">{confirmation.special_requests}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Event Information (only if attending) */}
          {confirmation.attending && (
            <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Información del Evento
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {formatDate(weddingDate)}
                    </p>
                    <p className="text-text-secondary text-sm">Sábado</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      Ceremonia: {formatTime(ceremonyTime)}
                    </p>
                    <p className="text-text-secondary text-sm">
                      Recepción: {formatTime(receptionTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Ubicaciones</p>
                    <p className="text-text-secondary text-sm mb-1">
                      <strong>Ceremonia:</strong> Iglesia San José<br />
                      Calle Principal 123
                    </p>
                    <p className="text-text-secondary text-sm">
                      <strong>Recepción:</strong> Salón "El Jardín"<br />
                      Avenida de las Flores 456
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
              Acciones
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {confirmation.attending && (
                <Button
                  variant="outline"
                  onClick={downloadCalendarEvent}
                  className="flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Agregar al Calendario
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={shareEvent}
                className="flex items-center justify-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Evento
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/informacion')}
                className="flex items-center justify-center"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ver Información
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/registro')}
                className="flex items-center justify-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Editar Confirmación
              </Button>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
              ¿Necesitas ayuda?
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-primary mr-3" />
                <span className="text-text-secondary">+52 55 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-primary mr-3" />
                <span className="text-text-secondary">maria.juan.boda@email.com</span>
              </div>
            </div>
          </div>
          
          {/* Final Message */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-xl shadow-elegant p-6 text-center text-white">
            <Heart className="h-8 w-8 mx-auto mb-4" />
            {confirmation.attending ? (
              <>
                <h2 className="font-heading text-xl font-semibold mb-2">
                  ¡Nos vemos en la boda!
                </h2>
                <p className="mb-4 opacity-90">
                  Estamos emocionados de celebrar este día especial contigo. 
                  ¡Será una celebración inolvidable!
                </p>
              </>
            ) : (
              <>
                <h2 className="font-heading text-xl font-semibold mb-2">
                  Te extrañaremos
                </h2>
                <p className="mb-4 opacity-90">
                  Aunque no puedas acompañarnos, sabes que estarás en nuestros corazones 
                  en este día tan especial.
                </p>
              </>
            )}
            
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="bg-white text-primary hover:bg-gray-50 flex items-center mx-auto"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage