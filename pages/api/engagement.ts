import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";


// GET?user_id=xxx
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== "GET") return res.status(405).end();
const user_id = req.query.user_id as string;
if (!user_id) return res.status(400).json({ error: "Missing user_id" });


// asumsi tabel `engagement` dengan kolom user_id, date, impressions, clicks, conversions
const { data, error } = await supabaseServer
.from("engagement")
.select("id, date, impressions, clicks, conversions")
.eq("user_id", user_id)
.order("date", { ascending: true });


if (error) return res.status(500).json({ error: error.message });
return res.status(200).json({ engagement: data });
}
