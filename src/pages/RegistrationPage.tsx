import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { Heart, Plus, Trash2, Check, X, Users, Utensils } from 'lucide-react'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { useConfirmation } from '../hooks/useConfirmation'
import { cn } from '../lib/utils'
import type { Guest } from '../lib/supabase'

interface RegistrationForm {
  attending: boolean
  dietary_restrictions: string
  special_requests: string
  plus_ones: Array<{
    name: string
    dietary_restrictions: string
  }>
}

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const { submitConfirmation, getConfirmation, loading, error } = useConfirmation()
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegistrationForm>({
    defaultValues: {
      attending: true,
      dietary_restrictions: '',
      special_requests: '',
      plus_ones: []
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plus_ones'
  })
  
  const watchAttending = watch('attending')
  
  useEffect(() => {
    // Verificar si hay un invitado en sessionStorage
    const guestData = sessionStorage.getItem('currentGuest')
    if (!guestData) {
      navigate('/')
      return
    }
    
    const guest = JSON.parse(guestData) as Guest
    setCurrentGuest(guest)
    
    // Cargar confirmación existente si la hay
    const loadExistingConfirmation = async () => {
      const existingConfirmation = await getConfirmation(guest.id)
      if (existingConfirmation) {
        setValue('attending', existingConfirmation.attending)
        setValue('dietary_restrictions', existingConfirmation.dietary_restrictions || '')
        setValue('special_requests', existingConfirmation.special_requests || '')
        
        // Cargar acompañantes existentes
        if (existingConfirmation.plus_ones) {
          existingConfirmation.plus_ones.forEach(plusOne => {
            append({
              name: plusOne.name,
              dietary_restrictions: plusOne.dietary_restrictions || ''
            })
          })
        }
      }
    }
    
    loadExistingConfirmation()
  }, [])
  
  const onSubmit = async (data: RegistrationForm) => {
    if (!currentGuest) return
    
    const success = await submitConfirmation({
      guest_id: currentGuest.id,
      attending: data.attending,
      dietary_restrictions: data.dietary_restrictions || undefined,
      special_requests: data.special_requests || undefined,
      plus_ones: data.attending ? data.plus_ones : []
    })
    
    if (success) {
      setIsSubmitted(true)
      setTimeout(() => {
        navigate('/confirmacion')
      }, 2000)
    }
  }
  
  const addPlusOne = () => {
    append({ name: '', dietary_restrictions: '' })
  }
  
  if (!currentGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    )
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light to-secondary">
        <div className="bg-white rounded-xl shadow-elegant p-8 max-w-md w-full mx-4 text-center">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-2">
            ¡Confirmación Enviada!
          </h2>
          <p className="text-text-secondary">
            Gracias por confirmar tu asistencia. Te redirigiremos en un momento...
          </p>
          <LoadingSpinner size="sm" className="mt-4" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="font-heading text-3xl font-semibold text-text-primary mb-2">
                Confirmación de Asistencia
              </h1>
              <p className="text-text-secondary">
                Hola <span className="font-semibold text-primary">{currentGuest.first_name}</span>, 
                por favor confirma tu asistencia a nuestra boda
              </p>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Attendance Confirmation */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                ¿Podrás acompañarnos?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={cn(
                  'flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                  watchAttending
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                )}>
                  <input
                    {...register('attending')}
                    type="radio"
                    value="true"
                    className="sr-only"
                  />
                  <Check className="h-5 w-5 mr-2" />
                  Sí, asistiré
                </label>
                
                <label className={cn(
                  'flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                  !watchAttending
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                )}>
                  <input
                    {...register('attending')}
                    type="radio"
                    value="false"
                    className="sr-only"
                  />
                  <X className="h-5 w-5 mr-2" />
                  No podré asistir
                </label>
              </div>
            </div>
            
            {/* Additional Details (only if attending) */}
            {watchAttending && (
              <>
                {/* Dietary Restrictions */}
                <div className="bg-white rounded-xl shadow-elegant p-6">
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <Utensils className="h-5 w-5 mr-2" />
                    Restricciones Dietéticas
                  </h3>
                  
                  <textarea
                    {...register('dietary_restrictions')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                    placeholder="Vegetariano, vegano, alergias, intolerancias... (opcional)"
                  />
                </div>
                
                {/* Plus Ones */}
                <div className="bg-white rounded-xl shadow-elegant p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg font-semibold text-text-primary flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Acompañantes
                    </h3>
                    {fields.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPlusOne}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    )}
                  </div>
                  
                  {fields.length === 0 ? (
                    <p className="text-text-secondary text-center py-4">
                      No has agregado acompañantes
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-text-primary">
                              Acompañante {index + 1}
                            </h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-1">
                                Nombre completo *
                              </label>
                              <input
                                {...register(`plus_ones.${index}.name`, {
                                  required: 'El nombre es requerido'
                                })}
                                type="text"
                                className={cn(
                                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                                  errors.plus_ones?.[index]?.name ? 'border-red-300' : 'border-gray-300'
                                )}
                                placeholder="Nombre del acompañante"
                              />
                              {errors.plus_ones?.[index]?.name && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.plus_ones[index]?.name?.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-1">
                                Restricciones dietéticas
                              </label>
                              <input
                                {...register(`plus_ones.${index}.dietary_restrictions`)}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                placeholder="Opcional"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Special Requests */}
                <div className="bg-white rounded-xl shadow-elegant p-6">
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-4">
                    Solicitudes Especiales
                  </h3>
                  
                  <textarea
                    {...register('special_requests')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                    placeholder="¿Hay algo especial que debamos saber? (opcional)"
                  />
                </div>
              </>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                  disabled={loading}
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Confirmar Asistencia'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage