// pages/api/engagement-data.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

// Menggunakan Service Role Key yang AMAN untuk operasi backend
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // HARUS menggunakan Service Role Key
);

// -----------------------------------------------------------------
// TYPE DEFINITION
// -----------------------------------------------------------------
type Engagement = {
    id: string;
    user_id: string;
    sessionContext: string;
    // Tambahkan properti lain yang relevan dari tabel 'engagements'
};

// -----------------------------------------------------------------
// HELPER FUNCTIONS (Logika Bisnis/Parsing)
// -----------------------------------------------------------------

/**
 * Mengekstrak nilai "keyFact" dari string JSON context.
 * Diasumsikan fungsi ini sudah ada.
 */
const extractMemoryMarker = (contextString: string): string => {
    // ASUMSI: Regex untuk KeyFact Anda
    const regex = /"keyFact"[\s\S]*?:[\s\S]*?"([\s\S]*?)"/; 
    const match = contextString.match(regex);
    if (match && match[1]) {
        return match[1].replace(/\\n/g, ' ').replace(/\n/g, ' ').trim(); 
    }
    return 'Not available';
};


/**
 * Mengekstrak nilai "reasoning" dari string JSON context.
 * FIX 1: Menambahkan tipe 'string' pada parameter.
 */
const extractReasoning = (contextString: string): string => { 
    // Regex mencari kunci "reasoning", diikuti oleh nilai string di antara tanda kutip ganda
    const regex = /"reasoning"[\s\S]*?:[\s\S]*?"([\s\S]*?)"/; 
    const match = contextString.match(regex);
    
    if (match && match[1]) {
        // Membersihkan karakter newline/escape newline
        return match[1].replace(/\\n/g, ' ').replace(/\n/g, ' ').trim(); 
    }
    
    return 'Not available';
};


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
        // Logika ini mungkin dibutuhkan untuk filter RLS atau branding
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("display_name")
            .eq("id", userId)
            .single();
        
        if (profileError || !profileData || !profileData.display_name) {
            return res.status(404).json({ error: 'User profile or BrandName not found.' });
        }
        
        const userBrandName = profileData.display_name;

        // 2. FETCH ENGAGEMENT DATA: Filter tabel berdasarkan BrandName
        const { data: engagementData, error: engagementError } = await supabaseAdmin
            .from("engagements")
            .select("*") 
            .eq("BrandName", userBrandName); // Filter data berdasarkan BrandName user yang login

        if (engagementError) {
            console.error("Supabase Error:", engagementError);
            return res.status(500).json({ error: 'Error fetching engagement data.' });
        }
        
        // FIX 3: Menggunakan variabel yang benar (engagementData) dan FIX 2: Menggunakan extractReasoning
        const mappedData = engagementData.map((e) => ({
            ...e,
            sessionContext: e.sessionContext, 
            keyFact: extractMemoryMarker(e.sessionContext), 
            finalEvaluation: extractReasoning(e.sessionContext), // Diganti dari extractMonitoringGuidance
        }));

        // 4. SUMMARY CALCULATION (Jika ada logika perhitungan ringkasan di server)
        // ... (Tambahkan logika ringkasan di sini jika diperlukan) ...

        // 5. MENGEMBALIKAN DATA
        res.status(200).json(mappedData || []);
        
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
