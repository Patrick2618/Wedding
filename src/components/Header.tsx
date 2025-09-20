import React, { useState, useEffect } from 'react'
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

  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const banner = document.getElementById("banner");
    if (!banner) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // cuando el banner ya NO es visible en pantalla → mostrar header
        setShowHeader(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );
    observer.observe(banner);
    return () => {
      if (banner) observer.unobserve(banner);
    };
  }, []);

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
    <>
      <header
        className={`bg-[#fdfcf9]/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 h-16 font-[Great Vibes] transition-transform duration-500 ease-out transform ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

          {/* Logo + nombres */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 rounded-full border-2 border-amber-700/60 grid place-items-center logo-header">
              <span className="font-heading text-lg tracking-widest text-amber-700">DJL</span>
            </div>
            
            <div className="hidden sm:block leading-tight">
              <h1 className="text-lg font-[Times New Roman] tracking-wide text-gray-900">
                DAMARIZ <span className="font-[Times New Roman] text-base">&</span> JOSÉ LUIS
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
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
                  'text-base transition-colors hover:text-primary',
                  isActive(item.href)
                    ? 'text-primary border-b border-primary pb-0.5'
                    : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
            {invitado && (
              <button
                onClick={handleLogout}
                className="ml-3 text-sm text-primary hover:underline"
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
              className="font-[Great Vibes] tracking-wide"
              onClick={() => (window.location.href = "/inicio#boletoss")}
            >
              Confirmar Asistencia
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-900" />
            ) : (
              <Menu className="h-5 w-5 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 cel-nav">
            <nav className="flex flex-col space-y-4 font-[Great Vibes] text-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'transition-colors hover:text-primary px-2 py-1',
                    isActive(item.href)
                      ? 'text-primary bg-gray-100 rounded-lg'
                      : 'text-gray-700'
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
                  className="w-full font-[Great Vibes]"
                  onClick={() => {
                    setIsMenuOpen(false)
                    window.location.href = '/inicio#boletoss'
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
    </>
  )
}

export default Header