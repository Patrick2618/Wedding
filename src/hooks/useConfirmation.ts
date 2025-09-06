import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Confirmation, PlusOne } from '../lib/supabase'

interface ConfirmationData {
  guest_id: string
  attending: boolean
  dietary_restrictions?: string
  special_requests?: string
  plus_ones?: Array<{
    name: string
    dietary_restrictions?: string
  }>
}

interface UseConfirmationReturn {
  confirmation: Confirmation | null
  loading: boolean
  error: string | null
  submitConfirmation: (data: ConfirmationData) => Promise<boolean>
  getConfirmation: (guestId: string) => Promise<Confirmation | null>
  updateConfirmation: (confirmationId: string, data: Partial<ConfirmationData>) => Promise<boolean>
}

export const useConfirmation = (): UseConfirmationReturn => {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitConfirmation = async (data: ConfirmationData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Verificar si ya existe una confirmación
      const { data: existingConfirmation } = await supabase
        .from('confirmations')
        .select('id')
        .eq('guest_id', data.guest_id)
        .single()

      let confirmationResult
      
      if (existingConfirmation) {
        // Actualizar confirmación existente
        const { data: updatedConfirmation, error: updateError } = await supabase
          .from('confirmations')
          .update({
            attending: data.attending,
            dietary_restrictions: data.dietary_restrictions,
            special_requests: data.special_requests,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfirmation.id)
          .select()
          .single()

        if (updateError) throw updateError
        confirmationResult = updatedConfirmation
      } else {
        // Crear nueva confirmación
        const { data: newConfirmation, error: insertError } = await supabase
          .from('confirmations')
          .insert({
            guest_id: data.guest_id,
            attending: data.attending,
            dietary_restrictions: data.dietary_restrictions,
            special_requests: data.special_requests
          })
          .select()
          .single()

        if (insertError) throw insertError
        confirmationResult = newConfirmation
      }

      // Manejar acompañantes si los hay
      if (data.plus_ones && data.plus_ones.length > 0) {
        // Eliminar acompañantes existentes
        await supabase
          .from('plus_ones')
          .delete()
          .eq('confirmation_id', confirmationResult.id)

        // Insertar nuevos acompañantes
        const plusOnesData = data.plus_ones.map(plusOne => ({
          confirmation_id: confirmationResult.id,
          name: plusOne.name,
          dietary_restrictions: plusOne.dietary_restrictions
        }))

        const { error: plusOnesError } = await supabase
          .from('plus_ones')
          .insert(plusOnesData)

        if (plusOnesError) throw plusOnesError
      }

      setConfirmation(confirmationResult)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar confirmación'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getConfirmation = async (guestId: string): Promise<Confirmation | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('confirmations')
        .select(`
          *,
          plus_ones (*)
        `)
        .eq('guest_id', guestId)
        .single()

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null // No hay confirmación
        }
        throw supabaseError
      }

      setConfirmation(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener confirmación'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateConfirmation = async (confirmationId: string, data: Partial<ConfirmationData>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: updatedConfirmation, error: supabaseError } = await supabase
        .from('confirmations')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', confirmationId)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      setConfirmation(updatedConfirmation)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar confirmación'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    confirmation,
    loading,
    error,
    submitConfirmation,
    getConfirmation,
    updateConfirmation
  }
}

// Hook para obtener todas las confirmaciones (admin)
export const useAllConfirmations = () => {
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('confirmations')
          .select(`
            *,
            guests (*),
            plus_ones (*)
          `)
          .order('created_at', { ascending: false })

        if (supabaseError) throw supabaseError

        setConfirmations(data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar confirmaciones'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchConfirmations()
  }, [])

  return { confirmations, loading, error }
}