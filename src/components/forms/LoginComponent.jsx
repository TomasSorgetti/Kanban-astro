import { useState, useEffect } from "react";
import { supabaseClient } from "../../lib/supabase/client";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Login response:", { data, error });

    if (error) {
      setError(error.message);
      return;
    }

    // Configurar cookies manualmente
    if (data.session) {
      const domain =
        window.location.hostname === "localhost" ? "localhost" : "192.168.1.2";
      document.cookie = `sb-access-token=${
        data.session.access_token
      }; path=/; SameSite=Lax; domain=${domain}; max-age=${60 * 60 * 24 * 30}`;
      document.cookie = `sb-refresh-token=${
        data.session.refresh_token
      }; path=/; SameSite=Lax; domain=${domain}; max-age=${60 * 60 * 24 * 30}`;
      console.log("Cookies set manually:", document.cookie);
    }

    // Verificar sesión
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();
    console.log("Session after login:", { sessionData, sessionError });

    if (sessionError || !sessionData.session) {
      setError("No se pudo establecer la sesión");
      return;
    }

    // Verificar usuario
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(data.session.access_token);
    console.log("User from access token:", { userData, userError });

    window.location.href = "/dashboard";
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", {
        event,
        session,
        currentUrl: window.location.pathname,
      });
      if (
        event === "SIGNED_IN" &&
        session &&
        window.location.pathname.startsWith("/auth")
      ) {
        console.log("Session tokens:", {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        window.location.href = "/dashboard";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/auth/register" className="text-blue-500">
          Regístrate
        </a>
      </p>
    </div>
  );
}
