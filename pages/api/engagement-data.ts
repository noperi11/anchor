import { supabase } from "../../utils/supabase"; // Pastikan path ke supabase utility sudah benar
import { NextApiRequest, NextApiResponse } from 'next';

// -----------------------------------------------------------------
// HELPER REGEX FUNCTIONS (DIPINDAHKAN DARI FRONTEND)
// -----------------------------------------------------------------

// Fungsi 1: Mengekstrak 'key_facts_to_remember'
const extractMemoryMarker = (contextString: string) => {
  const finalRegex = /key_facts_to_remember=(.*?)(?:\s+preferences_expressed=|,|$)/;
  const finalMatch = contextString.match(finalRegex);
  
  if (finalMatch && finalMatch[1]) {
    return finalMatch[1].trim(); 
  }
  return 'Not found'; 
};

// Fungsi 2: Mengekstrak 'monitoringGuidance'
const extractMonitoringGuidance = (contextString: string) => {
  const regex = /"monitoringGuidance":\s*"([\s\S]*?)"/; 
  const match = contextString.match(regex);
  
  if (match && match[1]) {
    // Mengganti semua newline (\n) dan backslash ganda (\\n) dengan spasi
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

  // 1. Ambil User ID dari query parameter (disini kita asumsikan client mengirimnya)
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // A. FETCH PROFILE: Ambil display_name (Brand Name)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      return res.status(404).json({ error: 'Profile not found or access denied.' });
    }
    
    const userBrandName = profileData.display_name;

    // B. FETCH ENGAGEMENT: Gunakan Brand Name untuk filter
    const { data: engagementData, error: engagementError } = await supabase
      .from("Engagement")
      .select("sessionId, Brand, Scoring, Engagement, sessionContext") 
      .eq("Brand", userBrandName); 

    if (engagementError) {
      console.error("Supabase Error:", engagementError);
      return res.status(500).json({ error: 'Error fetching engagement data.' });
    }

    // C. PROCESSING: Jalankan Logic Regex di Server
    const processedData = (engagementData || []).map((e: any) => ({
      sessionId: e.sessionId || 'N/A',
      brand: e.Brand,
      scoring: e.Scoring,
      engagement: e.Engagement,
      sessionContext: e.sessionContext, 
      
      // Jalankan Regex di sisi server!
      keyFact: extractMemoryMarker(e.sessionContext), 
      finalEvaluation: extractMonitoringGuidance(e.sessionContext),
    }));

    // D. Kirim data yang sudah bersih ke Frontend
    res.status(200).json(processedData);
    
  } catch (e) {
    console.error("Server Error:", e);
    res.status(500).json({ error: 'Internal server error during processing.' });
  }
}
