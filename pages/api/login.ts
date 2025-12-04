import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API /login called with method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ error: "Email & password required" });
  }

  console.log("Attempting signInWithPassword for:", email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log("signInWithPassword response data:", data);
  console.log("signInWithPassword response error:", error);

  if (error || !data.user) {
    console.log("Login failed for user:", email);
    return res.status(401).json({ error: "Email atau password salah" });
  }

  console.log("Login success for user:", email);

  return res.status(200).json({
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    session: data.session,
  });
}
