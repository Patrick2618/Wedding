import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Guest } from '../lib/supabase'

interface UseGuestReturn {
  guest: Guest | null
  loading: boolean
  error: string | null
  findGuest: (email: string, lastName: string) => Promise<Guest | null>
  clearGuest: () => void
}

export const useGuest = (): UseGuestReturn => {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findGuest = async (email: string, lastName: string): Promise<Guest | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('guests')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('last_name', lastName.toLowerCase())
        .single()

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          setError('No se encontró ningún invitado con esos datos')
          return null
        }
        throw supabaseError
      }

      setGuest(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar invitado'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearGuest = () => {
    setGuest(null)
    setError(null)
  }

  return {
    guest,
    loading,
    error,
    findGuest,
    clearGuest
  }
}

// Hook para obtener todos los invitados (admin)
export const useAllGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('guests')
          .select('*')
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        setGuests(data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar invitados'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [])

  return { guests, loading, error }
}