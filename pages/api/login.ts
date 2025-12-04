// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  // ambil user dari supabase
  const { data: user, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
  });
}
