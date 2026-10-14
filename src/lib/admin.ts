import { cookies } from "next/headers";
import { getAuthorizedSupabaseClient } from "@/lib/supabase";

export const ADMIN_SESSION_COOKIE = "ayoayo_admin_session";
export const ADMIN_EMAIL = "admin@ayoayo.ph";

export async function getAdminContext() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const client = getAuthorizedSupabaseClient(token);
  if (!client) return null;

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser(token);
  if (userError || !user?.email) return null;

  const { data: admin, error: adminError } = await client
    .from("admin_users")
    .select("id, email, name, is_active")
    .eq("email", user.email.toLowerCase())
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin) return null;
  return { client, user, admin };
}
