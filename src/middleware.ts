import { defineMiddleware } from "astro/middleware";
import { createClient } from "./lib/supabase/server";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, request } = context;
  const supabase = createClient(cookies, request);

  // Obtener el access_token directamente
  const accessToken = cookies.get("sb-access-token")?.value;
  console.log("Access token from cookie:", accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);
  console.log("Middleware user:", { user, userError });

  if (!user && url.pathname.startsWith("/dashboard")) {
    console.log("Redirecting to /auth/login because no user");
    return Response.redirect(new URL("/auth/login", url));
  }

  if (user && url.pathname.startsWith("/auth")) {
    console.log("Redirecting to /dashboard because user is authenticated");
    return Response.redirect(new URL("/dashboard", url));
  }

  return next();
});
