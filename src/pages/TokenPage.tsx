import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvitado } from "../components/InvitadoContext";
import bg from "../assets/background.png";




export default function TokenPage() {
  const navigate = useNavigate();
  const { invitado, setInvitado } = useInvitado();
  const [openHelp, setOpenHelp] = useState(false);

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenValido = /^\d{8}$/.test(token);

 useEffect(() => {
  if (invitado) {
    navigate('/inicio', { replace: true });
  }
  //   if (invitado) return null;

  }, [invitado, navigate]);



  useEffect(() => {
    if (!openHelp) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenHelp(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openHelp]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenValido) {
        setError("El token debe tener exactamente 8 dígitos.");
        return;
    }

    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);

    try {
        const res = await fetch(`http://localhost:3000/api/invitados/${token}`, {
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
        cache: "no-store",
        });

        console.log("URL:", `http://localhost:3000/api/invitados/${token}`);

        console.log(res)
        if (!res.ok) {
        if (res.status === 404) throw new Error("Token no encontrado.");
        if (res.status === 400) throw new Error("Token inválido.");
        throw new Error(`Error del servidor (${res.status}).`);
        }

        const data = await res.json();
        console.log("DATA:", data);

        // Validaciones mínimas
        if (!data || !data.id || !data.nombre || !data.max_boletos) {
          throw new Error("Respuesta inesperada del servidor.");
        }


        const invitado = {
          id: Number(data.id),
          token: String(data.id), // usa `id` como token
          nombre_completo: data.nombre,
          boletos_maximos: data.max_boletos,
          email: null,
          telefono: data.telefono ?? null,
          mesa: null,
          confirmados: data.boletos ?? null,
          comida: null,
          notas: data.comentarios ?? null,
        };

        setInvitado(invitado);
        // NUEVO: persistir token e ir a /registro/:guestId
        localStorage.setItem("inv:token", String(data.token));
        navigate('/registro', { replace: true });
    } catch (err: any) {
        setError(err?.name === "AbortError" ? "Tiempo de espera agotado." : err?.message || "Error al validar token.");
    } finally {
        clearTimeout(t);
        setLoading(false);
    }
    };


  return (
    <div className="relative min-h-screen">
    <div
      className="absolute inset-0 bg-center bg-contain"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Tarjeta principal con estilo elegante */}
          <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-elegant p-8">
            {/* Monograma / sello */}
            <div className="mx-auto mb-6 grid place-items-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-700/60 grid place-items-center">
                <span className="font-heading text-xl tracking-widest text-amber-700">DJL</span>
              </div>
            </div>

            <h1 className="font-heading text-2xl font-semibold text-text-primary text-center">
              Acceso a tu invitación
            </h1>
            <p className="text-sm text-text-secondary text-center mt-2">
              Ingresa tu <strong>token de 8 dígitos</strong> para continuar.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Token
                </label>
                <input
                  id="token"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  placeholder="••••••••"
                  value={token}
                  onChange={(e) =>
                    setToken(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-inner"
                />
                <p className="mt-2 text-xs text-text-secondary">
                  Sólo números (8 dígitos).
                </p>
              </div>

              {error && (
                <div
                  aria-live="polite"
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!tokenValido || loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-white px-5 py-3 text-sm font-medium shadow-elegant hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Validando…" : "Entrar"}
              </button>

              {!tokenValido && token.length > 0 && (
                <p className="mt-2 text-xs text-destructive">
                  El token debe tener exactamente 8 dígitos.
                </p>
              )}
            </form>

            <button
              type="button"
              onClick={() => setOpenHelp(true)}
              className="mx-auto mt-6 block text-xs text-text-secondary hover:text-primary transition-colors underline underline-offset-4"
            >
              ¿Problemas con tu token?
            </button>
            
            {openHelp && (
            <div
              aria-modal="true"
              role="dialog"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpenHelp(false)}
              />

              {/* Panel */}
              <div className="relative w-full max-w-sm rounded-2xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-elegant p-6">
                <button
                  onClick={() => setOpenHelp(false)}
                  className="absolute right-3 top-3 rounded-full w-8 h-8 grid place-items-center border border-border hover:bg-black/5"
                  aria-label="Cerrar"
                >
                  ×
                </button>

                <div className="text-center mb-4">
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full border-2 border-amber-700/60 grid place-items-center">
                    <span className="font-heading text-base tracking-widest text-amber-700">DJL</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    Asistencia con tu token
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Contáctanos y con gusto te ayudamos.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-border bg-white/70 p-3">
                    <p className="text-sm font-medium text-text-primary">Niza Arellano</p>
                    <a
                      href="tel:+523312792189"
                      className="block text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      +52 33 1279 2189
                    </a>
                    <a
                      href="mailto:boda@d&jl.com"
                      className="block text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      boda@d&jl.com
                    </a>
                  </div>

                  <button
                    onClick={() => setOpenHelp(false)}
                    className="w-full rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium shadow-elegant hover:brightness-110"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </div>
  );
}
