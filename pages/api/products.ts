import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const method = req.method;


if (method === "GET") {
// GET?user_name=...
const seller_name = req.query.seller_name as string | undefined;
let query = supabaseServer.from("products").select("*");
if (seller_name) query = query.eq("seller_name", seller_name);
const { data, error } = await query.order("created_at", { ascending: false });
if (error) return res.status(500).json({ error: error.message });
return res.status(200).json({ products: data });
}


if (method === "POST") {
// body: { name, price, url, category, seller_name }
const { name, price, url, category, seller_name } = req.body;
if (!name || !price || !url || !category || !seller_name)
return res.status(400).json({ error: "Missing fields" });


const { data, error } = await supabaseServer.from("products").insert([
{ name, price, url, category, seller_name }
]);
if (error) return res.status(500).json({ error: error.message });
return res.status(201).json({ product: data?.[0] });
}


if (method === "PUT" || method === "PATCH") {
// update by id
const { id, ...update } = req.body;
if (!id) return res.status(400).json({ error: "Missing id" });
const { data, error } = await supabaseServer.from("products").update(update).eq("id", id);
if (error) return res.status(500).json({ error: error.message });
return res.status(200).json({ product: data?.[0] });
}
