import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";


// POST { email, password }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== "POST") return res.status(405).end();
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ error: "Missing credentials" });


const { data, error } = await supabaseServer
.from("users")
.select("id, name, email")
.eq("email", email)
.eq("password", password)
.limit(1)
.single();


if (error || !data) return res.status(401).json({ error: "Invalid credentials" });


// simple prototype: return user object; client simpan sesi minimal di localStorage
return res.status(200).json({ user: data });
}
