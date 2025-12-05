import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../lib/supabaseServer";

// FIX: definisikan getCurrentUser
async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseServer.auth.getUser();

  if (error) return null;
  return data.user;   // user.id digunakan untuk brand_members
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    // --- LOGIKA UTAMA OTORISASI ---
    const user = await getCurrentUser(req, res); // Dapatkan user object
    const userId = user?.id;
    
    // Logika Otorisasi diperlukan untuk POST, PUT, PATCH, DELETE

    // ===================================
    // GET PRODUCTS (Tidak perlu otorisasi ketat, tapi bisa difilter)
    // ===================================
    if (method === "GET") {
        const brand_id = req.query.brand_id as string | undefined;

        let query = supabaseServer.from("products").select("*");
        if (brand_id) query = query.eq("brand_id", brand_id); 
        
        // PENTING: Untuk menampilkan hanya produk yang boleh dilihat user tertentu,
        // Anda harus JOIN dengan brand_members dan filter berdasarkan userId,
        // tetapi untuk GET sederhana, kita biarkan saja (akses publik/sesuai RLS).

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ products: data });
    }

    // ===================================
    // CREATE PRODUCT (Wajib Otorisasi)
    // ===================================
    if (method === "POST") {
        const { name, price, url, category, brand_id } = req.body; 

        if (!name || !price || !url || !category || !brand_id) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // --- 1. OTENTIKASI ---
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not logged in." });
        }

        // --- 2. OTORISASI: Cek izin di brand_members ---
        const { count, error: memberError } = await supabaseServer
            .from('brand_members')
            .select('user_id', { count: 'exact' })
            .eq('user_id', userId)
            .eq('brand_id', brand_id); // Cek Brand ID yang dikirim user

        if (memberError) {
            console.error("Member Check Error:", memberError);
            return res.status(500).json({ error: "Authorization check failed." });
        }
        
        if (count === 0) {
            // User tidak ada di daftar pengelola Brand ini
            return res.status(403).json({ error: "Forbidden: Not authorized to manage this brand." });
        }

        // --- 3. AKSI: Insert yang Aman ---
        const { data, error } = await supabaseServer.from("products").insert([
            { name, price, url, category, brand_id }
        ]).select();

        if (error) return res.status(500).json({ error: error.message });

        return res.status(201).json({ product: data?.[0] });
    }

    // ===================================
    // UPDATE PRODUCT (Wajib Otorisasi)
    // ===================================
    if (method === "PUT" || method === "PATCH") {
        const { id, ...update } = req.body;

        if (!id) return res.status(400).json({ error: "Missing product id" });

        // --- 1. OTENTIKASI ---
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not logged in." });
        }

        // --- 2. OTORISASI: Cek Kepemilikan Brand dari Produk yang akan diubah ---
        
        // a. Cari tahu brand_id dari produk ini (perlu JOIN dengan brand_members)
        const { data: authorizedProduct, error: authError } = await supabaseServer
            .from("products")
            .select("brand_id, brand_members!inner(user_id)") // JOIN dengan brand_members
            .eq("id", id)
            .eq("brand_members.user_id", userId) // Filter hanya produk yang brandnya dikelola user
            .single();
        
        if (authError || !authorizedProduct) {
            // Jika error atau tidak ada data (tidak ditemukan atau user tidak berhak)
            return res.status(403).json({ error: "Forbidden: Product not found or not authorized to update." });
        }

        // --- 3. AKSI: Update yang Aman ---
        const { data, error } = await supabaseServer
            .from("products")
            .update(update)
            .eq("id", id)
            .select();

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ product: data?.[0] });
    }

    // ===================================
    // METHOD NOT ALLOWED
    // ===================================
    return res.status(405).json({ error: "Method not allowed" });
}
