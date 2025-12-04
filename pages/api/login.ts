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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return res.status(401).json({ error: "Email atau password salah" });
  }

  // login sukses → kirim data user
  return res.status(200).json({
    user: {
      id: data.user.id,
      email: data.user.email,
      // bisa include field lain sesuai kebutuhan
    },
    session: data.session 
  });
}
