// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

interface Cookie {
  name: string;
  value: string;
  [key: string]: any;
}

export function createClient(cookies: AstroCookies, request: Request) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") || "";
          const allCookies: Cookie[] = cookieHeader
            .split(";")
            .filter(Boolean)
            .map((cookie) => {
              const [name, value] = cookie.trim().split("=");
              return { name, value };
            });
          console.log("Server getAll cookies:", allCookies);
          const accessToken = allCookies.find(
            (cookie) => cookie.name === "sb-access-token"
          )?.value;
          console.log("Access token from getAll:", accessToken);
          return allCookies;
        },
        setAll(cookiesToSet: Cookie[]) {
          console.log("Server setAll cookies:", cookiesToSet);
          cookiesToSet.forEach(({ name, value, ...options }) => {
            cookies.set(name, value, {
              path: "/",
              sameSite: "lax",
              ...options,
            });
          });
        },
      },
    }
  );
}
