import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'; // asegúrate de tener navigate y Link
import { useInvitado } from '../components/InvitadoContext';
import { Menu, X, Heart } from 'lucide-react'
import { cn } from '../lib/utils'
import Button from './Button'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();
  const { invitado, clear } = useInvitado();

  
  const navigation = [
    { name: 'Inicio', href: '/inicio' },
    { name: 'Información', href: '/informacion' },
    // { name: 'Registro', href: '/registro' }
  ]
  
  const handleLogout = () => {
    clear();
    localStorage.removeItem('inv:payload');
    localStorage.removeItem('inv:token');
    navigate('/');
};
  const isActive = (path: string) => location.pathname === path
  
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-secondary sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-full group-hover:bg-accent transition-colors">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-xl font-semibold text-text-primary">
                Damaris & Jose Luis
              </h1>
              <p className="text-xs text-text-secondary -mt-1">
                29 Noviembre, 2025
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-text-secondary'
                )}
              >
                {item.name}
              </Link>
            ))}
            {invitado && (
              <button
                onClick={handleLogout}
                className="ml-3 text-sm font-medium text-primary hover:underline"
                title="Cerrar sesión y usar otro token"
              >
                ¿Tienes otro Token?
              </button>
            )}
          </nav>

          
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              variant="primary"
              size="sm"
              onClick={() => (window.location.href = "/inicio#boletoss")}
            >
              Confirmar Asistencia
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-text-primary" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'text-base font-medium transition-colors hover:text-primary px-2 py-1',
                    isActive(item.href)
                      ? 'text-primary bg-secondary/50 rounded-lg'
                      : 'text-text-secondary'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = '/inicio'
                  }}
                >
                  Confirmar Asistencia
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header