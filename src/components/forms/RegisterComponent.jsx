import { useState } from "react";
import { supabaseClient } from "../../lib/supabase/client";

export default function RegisterComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { company_name: companyName } },
    });

    console.log("Register response:", { data, error });

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
    console.log("Session after register:", { sessionData, sessionError });

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
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
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium">
            Nombre de la Empresa
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta?{" "}
        <a href="/auth/login" className="text-blue-500">
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
