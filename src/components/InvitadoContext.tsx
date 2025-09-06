import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Invitado = {
  id: number;
  token?: string; // 6–8 dígitos
  nombre_completo: string;
  boletos_maximos: number;
  email?: string | null;
  telefono?: string | null;
  mesa?: string | null;
  confirmados?: number | null; // mapea a boletos_solicitados
  comida?: string | null;       // NUEVO: mapea a backend.comida
  notas?: string | null;
};

type Ctx = {
  invitado: Invitado | null;
  setInvitado: (i: Invitado | null) => void;
  clear: () => void;
};

const InvitadoContext = createContext<Ctx | undefined>(undefined);

export function InvitadoProvider({ children }: { children: React.ReactNode }) {
  const [invitado, setInvitado] = useState<Invitado | null>(null);

  // Hidratar
    useEffect(() => {
    try {
        const raw = localStorage.getItem("inv:payload"); // antes: sessionStorage
        if (raw) setInvitado(JSON.parse(raw));
    } catch {}
    }, []);

    // Persistir
    useEffect(() => {
    try {
        if (invitado) localStorage.setItem("inv:payload", JSON.stringify(invitado)); // antes: sessionStorage
        else localStorage.removeItem("inv:payload");                                  // antes: sessionStorage
    } catch {}
    }, [invitado]);

  const clear = () => setInvitado(null);
  const value = useMemo(() => ({ invitado, setInvitado, clear }), [invitado]);
  return <InvitadoContext.Provider value={value}>{children}</InvitadoContext.Provider>;
}

export function useInvitado() {
  const ctx = useContext(InvitadoContext);
  if (!ctx) throw new Error("useInvitado debe usarse dentro de <InvitadoProvider>");
  return ctx;
}
