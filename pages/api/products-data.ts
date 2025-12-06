import { supabase } from "../../utils/supabase"; 
import { NextApiRequest, NextApiResponse } from 'next';

// -----------------------------------------------------------------
// API HANDLER
// -----------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userId = req.query.userId as string; // User ID dari client

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 1. FETCH PROFILE: Ambil BrandName (display_name) dari user yang login
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();
    
    if (profileError || !profileData || !profileData.display_name) {
      // Jika profil tidak ditemukan atau BrandName kosong
      return res.status(404).json({ error: 'User profile or BrandName not found.' });
    }
    
    const userBrandName = profileData.display_name;

    // 2. FETCH PRODUCTS: Filter tabel Products berdasarkan BrandName
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("ProductId","BrandName, ProductName, Category, ProductLink") // Select semua kolom yang relevan
      .eq("BrandName", userBrandName); // Filter berdasarkan BrandName user yang login

    if (productsError) {
      console.error("Supabase Error:", productsError);
      return res.status(500).json({ error: 'Error fetching products data.' });
    }

    // Mengembalikan data produk yang sudah difilter
    res.status(200).json(productsData || []);
    
  } catch (e) {
    console.error("Server Error:", e);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
