import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Heart, Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { useGuest } from '../hooks/useGuest'
import { cn } from '../lib/utils'
import { formatDate, formatTime } from '../lib/utils'
import { useInvitado } from "../components/InvitadoContext";
// (en la parte superior de src/pages/InformationPage.tsx) ⬅️ SOLO LO NUEVO
import imgVegano from "../assets/vegano.jpg";
import imgSalmon from "../assets/salmon.jpeg";
import imgCarne from "../assets/carne.jpg";


interface GuestAccessForm {
  email: string
  lastName: string
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { findGuest, loading, error } = useGuest()
  const [showAccessForm, setShowAccessForm] = useState(false)
  const { invitado } = useInvitado();
  const [confirmando, setConfirmando] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [boletos, setBoletos] = useState<number>(1);
  const opcionesComida = useMemo(() => ["vegano", "salmon", "carne"] as const, []);
  const [comidaSel, setComidaSel] = useState<string>(opcionesComida[0]);
  const [guardandoComida, setGuardandoComida] = useState(false);
  const [okComida, setOkComida] = useState<string | null>(null);
  const [errComida, setErrComida] = useState<string | null>(null);

  

  useEffect(() => {
    if (!invitado) navigate("/");
  }, [invitado, navigate]);

  const limite = useMemo(
    () => Math.max(1, invitado?.boletos_maximos ?? 1),
    [invitado]
  );

  useEffect(() => {
    if (!invitado) return;
    const clamp = (v: number) => Math.min(Math.max(1, Math.floor(v || 1)), limite);
    const stored = sessionStorage.getItem("inv:boletos");
    let inicial = 1;
    if (stored && !Number.isNaN(parseInt(stored, 10))) {
      inicial = clamp(parseInt(stored, 10));
    } else if (typeof invitado.confirmados === "number") {
      inicial = clamp(invitado.confirmados);
    }
    setBoletos(inicial);
  }, [invitado, limite]);

  useEffect(() => {
    sessionStorage.setItem("inv:boletos", String(boletos));
  }, [boletos]);

  useEffect(() => {
    if (!invitado) return;
    const stored = sessionStorage.getItem("inv:comida");
    const normaliza = (v?: string | null) => (v || "").toString().trim().toLowerCase();
    const fromStored = normaliza(stored);
    const fromInv = normaliza(invitado.comida);
    const valida = (v: string) => opcionesComida.includes(v as any);
    const inicial = valida(fromStored)
      ? fromStored
      : valida(fromInv)
      ? fromInv
      : opcionesComida[0];
    setComidaSel(inicial);
  }, [invitado, opcionesComida]);

  useEffect(() => {
    if (comidaSel) sessionStorage.setItem("inv:comida", comidaSel);
  }, [comidaSel]);

  if (!invitado) return null;

  const seleccionarBoletos = (n: number) => {
    const v = Math.min(Math.max(1, n), limite);
    setBoletos(v);
    setOk(null);
    setErr(null);
  };

  const confirmarAsistencia = async () => {
    if (!invitado?.token) {
      setErr("No hay token válido para confirmar.");
      return;
    }
    setConfirmando(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch(
        `http://localhost:3001/api/invitados/${invitado.token}/boletos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ boletos_solicitados: boletos }),
        }
      );

      if (!res.ok) {
        if (res.status === 400) throw new Error("Solicitud inválida.");
        if (res.status === 404) throw new Error("Invitación no encontrada.");
        throw new Error(`Error del servidor (${res.status}).`);
      }

      setOk("¡Asistencia confirmada! Gracias por tu respuesta ♥");
    } catch (e: any) {
      setErr(e?.message || "No se pudo confirmar la asistencia.");
    } finally {
      setConfirmando(false);
    }
  };

  const guardarComida = async () => {
    if (!invitado?.token) {
      setErrComida("No hay token válido para guardar la comida.");
      return;
    }
    setGuardandoComida(true);
    setOkComida(null);
    setErrComida(null);
    try {
      const res = await fetch(
        `http://localhost:3001/api/invitados/${invitado.token}/comida`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ comida: comidaSel }),
        }
      );
      if (!res.ok) {
        if (res.status === 400) throw new Error("Solicitud inválida.");
        if (res.status === 404) throw new Error("Invitación no encontrada.");
        throw new Error(`Error del servidor (${res.status}).`);
      }
      setOkComida("¡Registro de comida guardado!");
    } catch (e: any) {
      setErrComida(e?.message || "No se pudo guardar la comida.");
    } finally {
      setGuardandoComida(false);
    }
  };

  // Reemplaza tu helper de tarjetas de comida por ESTE (mejor para desktop y muestra <img/>)
  const renderFoodCard = (key: string, label: string, src: string) => {
    const activo = comidaSel === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setComidaSel(key)}
        aria-pressed={activo}
        className={[
          "group text-left rounded-2xl overflow-hidden shadow-elegant border transition",
          "bg-white/95 hover:bg-white hover:shadow-lg",
          activo ? "border-primary ring-2 ring-primary/30" : "border-border"
        ].join(" ")}
      >
        <figure className="relative w-full aspect-[16/10] overflow-hidden">
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {activo && (
            <div className="absolute inset-0 ring-inset ring-2 ring-primary pointer-events-none" />
          )}
        </figure>
        <div className="p-4 flex items-center justify-between">
          <span className="font-semibold text-text-primary">{label}</span>
          <span
            className={[
              "inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs",
              activo ? "bg-primary text-white border-primary" : "border-border text-transparent"
            ].join(" ")}
          >
            ✓
          </span>
        </div>
      </button>
    );
  };


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background-light via-secondary to-primary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative Hearts */}
            {/* <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <Heart className="h-6 w-6 text-accent animate-pulse" />
                <Heart className="h-8 w-8 text-primary" />
                <Heart className="h-6 w-6 text-accent animate-pulse" />
              </div>
            </div> */}
            
            {/* Main Heading */}
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-text-primary mb-6">
              Damariz & Jose Luis
            </h1>
            
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            
            <p className="text-xl lg:text-2xl text-text-secondary mb-8 font-light">
              Nos complace invitarte a celebrar nuestro día especial
            </p>
            
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-soft">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  Fecha
                </h3>
                <p className="text-text-secondary">
                  29 de Noviembre, 2025
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-soft">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  Hora
                </h3>
                <p className="text-text-secondary">
                  19:00 - 02:00
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-soft">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  Lugar
                </h3>
                <p className="text-text-secondary">
                  “La Macarena”
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById("boletoss");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="group"
                >

                <Users className="h-5 w-5 mr-2" />
                Confirmar Asistencia
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/informacion')}
              >
                Más Información
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Heart className="h-16 w-16 text-accent animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Heart className="h-12 w-12 text-primary animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Guest Access Form Modal */}
      {showAccessForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-elegant max-w-md w-full p-6 animate-fade-in">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-semibold text-text-primary mb-2">
                Acceso de Invitados
              </h2>
              <p className="text-text-secondary">
                Ingresa tus datos para confirmar tu asistencia
              </p>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  
                  type="email"
                  id="email"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  )}
                  placeholder="tu@email.com"
                />
                {}
              </div>
              
              <div>
                
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAccessForm(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
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
                    'Continuar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-semibold text-text-primary mb-6">
              Un Día Para Recordar
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              Después de años de amor y complicidad, hemos decidido dar el siguiente paso 
              en nuestras vidas. Queremos compartir este momento tan especial contigo, 
              rodeados de las personas que más queremos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-semibold text-text-primary mb-3">
                  Ceremonia
                </h3>
                <p className="text-text-secondary">
                  La ceremonia comenzará a las 18:00 en la parroquia de Ntra. Señora del Pueblito, 
                  seguida de un cóctel de bienvenida.
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-6">
                <h3 className="font-heading text-xl font-semibold text-text-primary mb-3">
                  Celebración
                </h3>
                <p className="text-text-secondary">
                  La cena y Celebración se llevará a cabo en el Salón Boutique “La Macarena” a partir de las 19:00 hrs
                  con música, baile y mucha diversión.
                </p>
              </div>




              {/* BOLETOS */}
              <div className="bg-gradient-to-r from-primary to-accent rounded-xl shadow-elegant text-white p-6 md:p-8 col-span-1 md:col-span-2 bg-white/10 rounded-2xl p-5 md:p-6 backdrop-blur mt-6" id='boletoss'>
                {/* Encabezado */}
                <div className="text-center max-w-2xl mx-auto boletos">
                  <Heart className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-heading text-xl md:text-2xl font-semibold mb-2">
                    ¡No olvides confirmar tu asistencia!
                  </h3>
                  <p className="opacity-90 fecha-limite">
                    Hasta el 1 de Octubre
                  </p>
                  <p className="opacity-90">
                    La cantidad que elijas será la <strong>máxima</strong>: uno es para usted y los demás para sus invitados.
                  </p>
                </div>

                {/* Grid maestro: 1 col en móvil, 2 en md; cada tarjeta ocupa 2 col en md (fila completa) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">

                  {/* === TARJETA: SELECCIÓN DE BOLETOS (full width) === */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="bg-white/10 rounded-2xl p-5 md:p-6 backdrop-blur">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading text-lg md:text-xl font-semibold"> Selecciona tus boletos {invitado.nombre_completo}</h4>
                        <span className="inline-flex items-center justify-center min-w-12 px-3 py-1 rounded-full border border-white/30 bg-white/10 text-sm font-medium">
                          {boletos}
                        </span>
                      </div>

                      {/* Botones “ticket” responsivos */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 boletos-selector">
                        {Array.from({ length: limite }).map((_, i) => {
                          const n = i + 1;
                          const activo = boletos === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              aria-pressed={activo}
                              onClick={() => seleccionarBoletos(n)}
                              className={[
                                "relative overflow-hidden px-3 py-2 rounded-xl border shadow-elegant text-sm font-medium transition boletos-botones",
                                activo
                                  ? "bg-white text-primary border-white"
                                  : "bg-white/15 text-white border-white/30 hover:bg-white/20"
                              ].join(" ")}
                            >
                              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background/60 border border-white/30" />
                              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background/60 border border-white/30" />
                              {n}
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-3 text-xs opacity-90">
                        Seleccionaste <span className="font-semibold">{boletos}</span> boleto(s).
                      </p>

                      <div className="mt-5 text-center">
                        <button
                          onClick={confirmarAsistencia}
                          disabled={confirmando}
                          className="inline-flex items-center justify-center rounded-xl bg-white text-primary hover:bg-gray-50 px-5 py-3 text-sm font-medium shadow-elegant disabled:opacity-70"
                        >
                          {confirmando ? "Confirmando…" : "Confirmar Asistencia"}
                        </button>

                        {ok && (
                          <p className="mt-3 text-sm text-white/90" role="status" aria-live="polite">
                            {ok}
                          </p>
                        )}
                        {err && (
                          <p className="mt-3 text-sm bg-white/15 rounded-md px-3 py-2" role="alert" aria-live="assertive">
                            {err}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* === TARJETA: SELECCIÓN DE COMIDA (full width) === */}
                  <div className="col-span-1 md:col-span-2 bg-white/10 rounded-2xl p-5 md:p-6 backdrop-blur mt-6">
                    <div className="rounded-2xl p-5 md:p-6">
                      <h4 className="font-heading text-lg md:text-xl font-semibold mb-4 text-white">Selecciona tu comida</h4>

                      {/* 1 columna en móvil, 3 columnas en desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {renderFoodCard("vegano", "Vegano", imgVegano)}
                        {renderFoodCard("salmon", "Salmón", imgSalmon)}
                        {renderFoodCard("carne", "Carne", imgCarne)}
                      </div>

                      <div className="mt-5 text-center">
                        <button
                          onClick={guardarComida}
                          disabled={guardandoComida}
                          className="inline-flex items-center justify-center rounded-xl bg-white text-primary hover:bg-gray-50 px-5 py-3 text-sm font-medium shadow-elegant disabled:opacity-70"
                        >
                          {guardandoComida ? "Guardando…" : "Guardar registro de comida"}
                        </button>

                        {okComida && (
                          <p className="mt-3 text-sm text-white/90" role="status" aria-live="polite">
                            {okComida}
                          </p>
                        )}
                        {errComida && (
                          <p className="mt-3 text-sm bg-white/15 rounded-md px-3 py-2" role="alert" aria-live="assertive">
                            {errComida}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>             

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage