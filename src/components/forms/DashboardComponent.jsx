import { useState, useEffect } from "react";
import { supabaseClient } from "../../lib/supabase/client";

export default function DashboardComponent({ user }) {
  const [clientUser, setClientUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabaseClient.auth.getSession();
      console.log("Client session:", { session, sessionError });

      if (sessionError || !session) {
        setError("No se pudo cargar la sesión");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      console.log("Client user:", { user, userError });

      if (userError || !user) {
        setError("No se pudo cargar el usuario");
        return;
      }

      setClientUser(user);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", {
        event,
        session,
        currentUrl: window.location.pathname,
      });
      if (event === "SIGNED_IN" && session) {
        setClientUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setClientUser(null);
        window.location.href = "/auth/login";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    console.log("Logout response:", { error });

    if (error) {
      setError(error.message);
      return;
    }

    // Limpiar cookies manualmente
    document.cookie = "sb-access-token=; path=/; max-age=0";
    document.cookie = "sb-refresh-token=; path=/; max-age=0";
    window.location.href = "/auth/login";
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!clientUser) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bienvenido, {clientUser.email}</p>
      <p>Empresa: {clientUser.user_metadata.company_name}</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
