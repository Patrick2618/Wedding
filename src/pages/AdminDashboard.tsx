import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Download, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  LogOut,
  BarChart3,
  Calendar,
  Utensils,
  Heart
} from 'lucide-react'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAdmin, useAdminAuth } from '../hooks/useAdmin'
import { useAllGuests } from '../hooks/useGuest'
import { useAllConfirmations } from '../hooks/useConfirmation'
import { cn, formatDate } from '../lib/utils'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, logout } = useAdminAuth()
  const { stats, exportGuestData, loading: adminLoading } = useAdmin()
  const { guests, loading: guestsLoading } = useAllGuests()
  const { confirmations, loading: confirmationsLoading } = useAllConfirmations()
  
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any existing data when not authenticated
      setPassword('')
      setLoginError('')
    }
  }, [isAuthenticated])
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    const success = await login(password)
    if (!success) {
      setLoginError('Contraseña incorrecta')
    }
  }
  
  const handleLogout = () => {
    logout()
    setPassword('')
  }
  
  const handleExport = async () => {
    await exportGuestData()
  }
  
  // Filter guests based on search and status
  const filteredGuests = guests?.filter(guest => {
    const matchesSearch = 
      guest.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (filterStatus === 'all') return true
    
    const confirmation = confirmations?.find(c => c.guest_id === guest.id)
    
    switch (filterStatus) {
      case 'confirmed':
        return confirmation?.attending === true
      case 'declined':
        return confirmation?.attending === false
      case 'pending':
        return !confirmation
      default:
        return true
    }
  }) || []
  
  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-secondary flex items-center justify-center py-8">
        <div className="bg-white rounded-xl shadow-elegant p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-text-primary mb-2">
              Panel de Administración
            </h1>
            <p className="text-text-secondary">
              Ingresa la contraseña para acceder
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                    loginError ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder="Ingresa la contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mt-1">{loginError}</p>
              )}
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!password.trim()}
            >
              Acceder
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Loading state
  if (adminLoading || guestsLoading || confirmationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-light to-secondary">
        <LoadingSpinner size="lg" text="Cargando panel de administración..." />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-3xl font-semibold text-text-primary mb-2">
                  Panel de Administración
                </h1>
                <p className="text-text-secondary">
                  Gestión de invitados y confirmaciones - Boda María & Juan
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Total Invitados</p>
                  <p className="text-2xl font-bold text-text-primary">{stats?.totalGuests || 0}</p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Confirmados</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.confirmedGuests || 0}</p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">No Asisten</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.declinedGuests || 0}</p>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Acompañantes</p>
                  <p className="text-2xl font-bold text-primary">{stats?.totalPlusOnes || 0}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Attendance Rate */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
              Tasa de Confirmación
            </h2>
            
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Progreso de confirmaciones</span>
                  <span className="font-medium text-text-primary">
                    {stats?.attendanceRate ? `${stats.attendanceRate.toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.attendanceRate || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">
                  {(stats?.confirmedGuests || 0) + (stats?.totalPlusOnes || 0)}
                </p>
                <p className="text-text-secondary text-sm">Total asistentes</p>
              </div>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="declined">No asisten</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Guests Table */}
          <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-heading text-xl font-semibold text-text-primary">
                Lista de Invitados ({filteredGuests.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invitado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acompañantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restricciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Confirmación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuests.map((guest) => {
                    const confirmation = confirmations?.find(c => c.guest_id === guest.id)
                    
                    return (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {guest.first_name} {guest.last_name}
                            </div>
                            {guest.phone && (
                              <div className="text-sm text-text-secondary">
                                {guest.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {guest.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {confirmation ? (
                            <span className={cn(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              confirmation.attending
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}>
                              {confirmation.attending ? 'Confirmado' : 'No asiste'}
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {confirmation?.plus_ones?.length || 0}
                          {confirmation?.plus_ones && confirmation.plus_ones.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              {confirmation.plus_ones.map((p: any) => p.name).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary max-w-xs">
                          <div className="truncate">
                            {confirmation?.dietary_restrictions || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {confirmation?.created_at 
                            ? formatDate(new Date(confirmation.created_at))
                            : '-'
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
              {filteredGuests.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-text-secondary">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No se encontraron invitados con los filtros aplicados'
                      : 'No hay invitados registrados'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard