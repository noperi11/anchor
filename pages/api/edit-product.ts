// pages/api/edit-product.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

// Gunakan Service Role Key yang AMAN untuk operasi UPDATE
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') { // Gunakan method PUT untuk operasi update
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Ambil ProductId dari body, dan data yang diupdate
    const { ProductId, ProductName, ProductLink, Category, BrandName } = req.body;

    if (!ProductId) {
        return res.status(400).json({ error: 'Product ID is required for update.' });
    }

    try {
        // Lakukan operasi UPDATE menggunakan Supabase Admin Client
        const { error } = await supabaseAdmin
            .from("products") // Pastikan nama tabel benar: "products"
            .update({
                ProductName,
                ProductLink,
                Category,
                BrandName,
            })
            .eq("ProductId", ProductId); // Filter berdasarkan ProductId

        if (error) {
            console.error("Supabase Update Error:", error);
            return res.status(500).json({ error: `Failed to update product: ${error.message}` });
        }

        // Jika berhasil, kirim status 200 OK
        return res.status(200).json({ message: 'Product updated successfully.' });

    } catch (e) {
        console.error("Internal Server Error:", e);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
