import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  // ===============================
  // GET ALL PRODUCTS
  // ===============================
  if (method === "GET") {
    const { data, error } = await supabaseServer
      .from("products")
      .select("*");

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ products: data });
  }

  // ===============================
  // CREATE PRODUCT
  // ===============================
  if (method === "POST") {
    const { UserId, BrandName, ProductName, Category, ProductLink } = req.body;

    // Pastikan semua field ada
    if (!UserId || !BrandName || !ProductName || !Category || !ProductLink) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { data, error } = await supabaseServer
      .from("products")
      .insert([
        {
          UserId,
          BrandName,
          ProductName,
          Category,
          ProductLink,
        }
      ])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ product: data?.[0] });
  }

  // ===============================
  // METHOD NOT ALLOWED
  // ===============================
  return res.status(405).json({ error: "Method not allowed" });
}
