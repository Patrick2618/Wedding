import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuest } from '../hooks/useGuest'
import { useInvitado } from "../components/InvitadoContext";


import img1 from '../assets/img1.jpeg';
import img2 from '../assets/img2.jpeg';
import img3 from '../assets/img3.jpeg';
import img4 from '../assets/img4.jpeg';
import img5 from '../assets/img5.jpeg';
import img6 from '../assets/img6.jpeg';
import img7 from '../assets/img7.jpeg';
import img8 from '../assets/img8.jpeg';
import img9 from '../assets/img9.jpeg';
import img10 from '../assets/img10.jpeg';
import img11 from '../assets/img11.jpeg';
import img12 from '../assets/background.png';



const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { invitado } = useInvitado();
  const [confirmando, setConfirmando] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [boletos, setBoletos] = useState<number>(1);
  const opcionesComida = useMemo(() => ["vegano", "salmon", "carne"] as const, []);
  const [comidaSel, setComidaSel] = useState<string>(opcionesComida[0]);

  const imag = [
    img1, img2, img3 , img4, img5, img6, img7, img8, img9, img10, img11
  ];

  const IMAGES = [
    img12
  ];
  const secs = 4;
  const total = IMAGES.length * secs;

  const [current, setCurrent] = useState(0);

  // Cambio automático cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imag.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imag.length]);

  const goToSlide = (index: number) => setCurrent(index);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + imag.length) % imag.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % imag.length);

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
    // obligamos a que sea string
    const token = invitado?.token 
      ? String(invitado.token).padStart(8, "0") // rellena con ceros si hiciera falta
      : null;

    console.log("DEBUG token:", token);

    if (!token || !/^\d{8}$/.test(token)) {
      setErr("No hay token válido para confirmar.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/invitados/${token}/boletos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
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




  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        id="banner" 
        className="relative -mt-16 w-screen h-screen z-[60] flex items-center justify-center text-lg md:text-xl"
      >
        <div className="relative w-full h-full">

          {/* SLIDESHOW */}
          <div className="slideshow-wrapper relative w-full h-full overflow-hidden">

            {/* Slides */}
            <div className="absolute inset-0 z-0">
              {IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="slideshow-slide absolute inset-0"
                  style={{
                    backgroundImage: `url(${src})`,
                    animation: `fade ${total}s linear infinite`,
                    animationDelay: `${i * secs}s`
                  }}
                  aria-hidden="true"
                />
              ))}
              {/* máscara */}
              {/* <div className="photo-mask absolute inset-0 z-10 pointer-events-none" /> */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
            </div>

            {/* CONTENIDO ENCIMA DEL SLIDESHOW */}
            <div className="relative z-20 flex items-center justify-center h-full banner">
              <div className="text-center text-white w-full">

                {/* Padres */}
                <p className="text-base tracking-[0.15em] mb-6 font-[Times New Roman] uppercase leading-relaxed padrees" id='first-text'>
                  Con la bendición de Dios y en compañía de nuestros padres:
                </p>

                <div className="grid grid-cols-2 gap-4 text-m tracking-[0.15em] mb-10 font-[Times New Roman] uppercase leading-relaxed">
                  <div>
                    <p className='padrees'>José Luis Brenez Moreno</p>
                    <p className='padrees'>M. Patricia Sandoval de Brenez</p>
                  </div>
                  <div>
                    <p className='padrees'>Blanca E. Mora Gómez</p>
                  </div>
                </div>

                {/* Nombres — más grandes y con máscara ligera detrás para máxima legibilidad */}
                <div className="inline-block py-2 rounded-lg ff">
                  <h2 className="name-large font-great">DAMARIZ</h2>
                  <span className="block name-amp font-y mb-1 span-text">&</span>
                  <h2 className="name-large font-great">JOSÉ LUIS</h2>
                </div>


                {/* Texto invitación (text-base medium) */}
                <p className="text-lg md:text-xl font-medium tracking-[0.15em] mt-6 mb-4 font-[Times New Roman] uppercase leading-relaxed text-black/90 inicio-pad">
                  Tenemos el honor de invitarle a la ceremonia de bendición de nuestra unión que se celebrará el día
                </p>

                {/* Fecha y lugar */}
                <p className="text-lg font-[Times New Roman] uppercase mb-4 tracking-[0.1em] text-date">
                  Sábado 29 de Noviembre a las 18:00 hrs.
                </p>

                <p className="text-sm font-[Times New Roman] uppercase leading-relaxed tracking-[0.15em] text-black/90 banner-small">
                  La bendición será impartida por el Sr. Cura Juan Gilberto Huerta Reyes <br />
                  en la Parroquia de Santa María del Pueblito, Benito Juárez No. 5581, C.P. 45018.
                </p>

                <p className="text-sm italic mt-6 font-[Times New Roman] text-black/80 banner-small">
                  Zapopan, Jalisco, 2025
                </p>
              </div>
            </div>
          </div>

          </div>
      </section>


      {/* Additional Info Section */}
      <section className="py-16 bg-white font-[Times New Roman]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary/30 rounded-lg p-6 ceremonias">
                <h3 className="font-heading text-xl font-semibold text-text-primary mb-3">
                  Ceremonia
                </h3>
                <p className="text-text-secondary">
                  La ceremonia comenzará a las 18:00 en la parroquia de Ntra. Señora del Pueblito
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-6 ceremonias">
                <h3 className="font-heading text-xl font-semibold text-text-primary mb-3">
                  Celebración
                </h3>
                <p className="text-text-secondary">
                  La ceremonia civíl y la recepcion se llevará a cabo en el Salón Boutique “La Macarena” a partir de las 19:30 hrs
                  con música, baile y mucha diversión.
                </p>
              </div>


              {/* BOLETOS */}
              <div className="rounded-2xl shadow-elegant p-6 md:p-8 col-span-1 md:col-span-2 backdrop-blur mt-6" id='boletoss'>
                {/* Encabezado */}
                <div className="text-center max-w-2xl mx-auto boletos">
                  <h3 className="font-heading text-xl md:text-2xl font-semibold mb-2 boletos-texto">
                    RSVP
                  </h3>
                  <p className="opacity-90 fecha-limite boletos-texto">
                    Hasta el 16 de Noviembre
                  </p>
                  <p className="opacity-90 boletos-texto">
                    La cantidad que elijas será la <strong>máxima</strong>: uno es para usted y los demás para sus invitados.
                  </p>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">

                  {/* === SELECCIÓN DE BOLETOS === */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="boletos-sub rounded-2xl p-5 md:p-6 backdrop-blur">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading text-lg md:text-xl font-semibold">
                          Selecciona tus boletos {invitado.nombre_completo}
                        </h4>
                        <span className="inline-flex items-center justify-center min-w-12 px-3 py-1 rounded-full border border-[#2b2b2b]/30 bg-white/60 text-sm font-medium">
                          {boletos}
                        </span>
                      </div>

                      {/* Botones */}
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
                                  ? "bg-[rgb(253_252_249_/_0.9)] text-[#2b2b2b] border-[#2b2b2b]"
                                  : "boletos-sub text-[#2b2b2b] border-[#2b2b2b]/30 hover:bg-white/60"
                              ].join(" ")}
                            >
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
                          className="inline-flex items-center justify-center rounded-xl bg-[rgb(253_252_249_/_0.9)] text-[#2b2b2b] hover:bg-white px-5 py-3 text-sm font-medium shadow-elegant disabled:opacity-70"
                        >
                          {confirmando ? "Confirmando…" : "Confirmar Asistencia"}
                        </button>

                        {ok && (
                          <p className="mt-3 text-sm text-[#2b2b2b]/90" role="status" aria-live="polite">
                            {ok}
                          </p>
                        )}
                        {err && (
                          <p className="mt-3 text-sm boletos-sub rounded-md px-3 py-2 text-[#2b2b2b]" role="alert" aria-live="assertive">
                            {err}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>


              <div className="relative w-full flex justify-center items-center py-16 overflow-hidden container-photos">
                <div className="bubbles">
                  <div className="bubble bubble-1"></div>
                  <div className="bubble bubble-2"></div>
                  <div className="bubble bubble-3"></div>
                  <div className="bubble bubble-4"></div>
                </div>

                <div className="w-full max-w-4xl mx-auto text-center photo-box">
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text-primary mb-6">
                    Nuestra Historia en Fotos
                  </h2>

                  {/* CARRUSEL: aquí van las burbujas dentro del contenedor padre */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg border-4 border-secondary">
                    {/* Fondo animado DENTRO del contenedor del carrusel */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <div
                        className="absolute w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl bg-secondary/30 bg-bubble"
                        style={{ top: '2rem', left: '2rem', animationDelay: '0s' }}
                      />
                      <div
                        className="absolute w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl bg-secondary/20 bg-bubble"
                        style={{ top: '30%', right: '2rem', animationDelay: '2s' }}
                      />
                      <div
                        className="absolute w-[26rem] h-[26rem] rounded-full mix-blend-multiply filter blur-3xl bg-secondary/25 bg-bubble"
                        style={{ bottom: '1.5rem', left: '25%', animationDelay: '4s' }}
                      />
                    </div>

                    {/* Slides (por encima del fondo animado) */}
                    <div className="relative z-10">
                      <div
                        className="flex transition-transform ease-in-out duration-700"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                      >
                        {imag.map((src, idx) => (
                          <div key={idx} className="w-full flex-shrink-0 relative h-[400px] md:h-[550px]">
                            <img src={src} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>

                      {/* Botones sobre las imágenes */}
                      <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-secondary/70 text-white p-3 rounded-full hover:bg-secondary transition"
                      >‹</button>

                      <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-secondary/70 text-white p-3 rounded-full hover:bg-secondary transition"
                      >›</button>
                    </div>
                  </div>

                  {/* Miniaturas */}
                  <div className="flex justify-center mt-4 gap-2 flex-wrap">
                    {imag.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition ${
                          idx === current ? "border-secondary" : "border-transparent"
                        }`}
                      >
                        <img src={src} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
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