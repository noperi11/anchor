// pages/api/delete-product.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

// Menggunakan Service Role Key yang AMAN untuk operasi backend
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // HARUS menggunakan Service Role Key
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ProductId diambil dari body request (karena ini adalah DELETE)
    const { ProductId } = req.body; 

    if (!ProductId || typeof ProductId !== 'string') {
        return res.status(400).json({ error: 'Valid ProductId is required.' });
    }

    try {
        // Lakukan operasi DELETE menggunakan Supabase Admin Client
        const { error } = await supabaseAdmin
            .from("products")
            .delete()
            .eq("ProductId", ProductId); // Diasumsikan ProductId adalah kolom UUID

        if (error) {
            console.error("Supabase Delete Error:", error);
            // Error 22P02 (invalid UUID) akan ditangani di sini
            return res.status(500).json({ error: `Failed to delete product: ${error.message}` });
        }

        // Jika berhasil, kirim status 204 No Content
        return res.status(204).end(); 

    } catch (e) {
        console.error("Internal Server Error:", e);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
