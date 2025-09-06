import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Guest, Confirmation } from '../lib/supabase'

interface AdminStats {
  totalGuests: number
  totalConfirmations: number
  confirmedGuests: number
  declinedGuests: number
  pendingResponses: number
  totalPlusOnes: number
  attendanceRate: number
  responseRate: number
}

interface GuestWithConfirmation extends Guest {
  confirmations?: Confirmation[]
}

interface UseAdminReturn {
  stats: AdminStats | null
  guestsWithConfirmations: GuestWithConfirmation[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  exportGuestData: () => Promise<void>
}

export const useAdmin = (): UseAdminReturn => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [guestsWithConfirmations, setGuestsWithConfirmations] = useState<GuestWithConfirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Obtener todos los invitados con sus confirmaciones
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select(`
          *,
          confirmations (
            *,
            plus_ones (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (guestsError) throw guestsError

      const guests = guestsData || []
      setGuestsWithConfirmations(guests)

      // Calcular estadísticas
      const totalGuests = guests.length
      const guestsWithConfirmations = guests.filter(guest => guest.confirmations && guest.confirmations.length > 0)
      const totalConfirmations = guestsWithConfirmations.length
      
      const confirmedGuests = guestsWithConfirmations.filter(
        guest => guest.confirmations?.[0]?.attending === true
      ).length
      
      const declinedGuests = guestsWithConfirmations.filter(
        guest => guest.confirmations?.[0]?.attending === false
      ).length
      
      const pendingResponses = totalGuests - totalConfirmations
      
      // Calcular total de acompañantes
      let totalPlusOnes = 0
      guestsWithConfirmations.forEach(guest => {
        if (guest.confirmations?.[0]?.plus_ones) {
          totalPlusOnes += guest.confirmations[0].plus_ones.length
        }
      })
      
      const attendanceRate = totalConfirmations > 0 ? (confirmedGuests / totalConfirmations) * 100 : 0
      const responseRate = totalGuests > 0 ? (totalConfirmations / totalGuests) * 100 : 0

      const adminStats: AdminStats = {
        totalGuests,
        totalConfirmations,
        confirmedGuests,
        declinedGuests,
        pendingResponses,
        totalPlusOnes,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        responseRate: Math.round(responseRate * 100) / 100
      }

      setStats(adminStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos administrativos'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchAdminData()
  }

  const exportGuestData = async () => {
    try {
      // Preparar datos para exportación
      const exportData = guestsWithConfirmations.map(guest => {
        const confirmation = guest.confirmations?.[0]
        const plusOnes = confirmation?.plus_ones || []
        
        return {
          'Nombre': guest.first_name,
          'Apellido': guest.last_name,
          'Email': guest.email,
          'Teléfono': guest.phone || '',
          'Asiste': confirmation ? (confirmation.attending ? 'Sí' : 'No') : 'Sin respuesta',
          'Restricciones Dietéticas': confirmation?.dietary_restrictions || '',
          'Solicitudes Especiales': confirmation?.special_requests || '',
          'Acompañantes': plusOnes.map(po => po.name).join(', '),
          'Restricciones Acompañantes': plusOnes.map(po => po.dietary_restrictions || '').join(', '),
          'Fecha Confirmación': confirmation?.created_at ? new Date(confirmation.created_at).toLocaleDateString('es-ES') : ''
        }
      })

      // Convertir a CSV
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n')

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `invitados_boda_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar datos'
      setError(errorMessage)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  return {
    stats,
    guestsWithConfirmations,
    loading,
    error,
    refreshData,
    exportGuestData
  }
}

// Hook para autenticación de admin (simple)
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Contraseña simple para demo (en producción usar autenticación real)
      const adminPassword = 'admin2024'
      
      if (password === adminPassword) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        return true
      } else {
        setError('Contraseña incorrecta')
        return false
      }
    } catch (err) {
      setError('Error de autenticación')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  useEffect(() => {
    // Verificar si ya está autenticado
    const isAuth = localStorage.getItem('admin_authenticated') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout
  }
}