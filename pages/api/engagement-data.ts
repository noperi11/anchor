import { supabase } from "../../utils/supabase"; 
import { NextApiRequest, NextApiResponse } from 'next';

// -----------------------------------------------------------------
// TYPES (Untuk konsistensi)
// -----------------------------------------------------------------

type Engagement = {
  sessionId: string;
  scoring: number;
  engagement: string; 
  sessionContext: string;
  brand: string;
  keyFact: string; 
  finalEvaluation: string; 
};

type SummaryMetric = {
    metric: string;
    value: string | number;
};

// -----------------------------------------------------------------
// HELPER REGEX FUNCTIONS 
// -----------------------------------------------------------------

const extractMemoryMarker = (contextString: string) => {
  const finalRegex = /key_facts_to_remember=(.*?)(?:\s+preferences_expressed=|,|$)/;
  const finalMatch = contextString.match(finalRegex);
  if (finalMatch && finalMatch[1]) {
    return finalMatch[1].trim(); 
  }
  return 'Not found'; 
};

const extractReasoning = (contextString: string) => { 
    // Regex mencari kunci "reasoning"...
    const regex = /"reasoning"[\s\S]*?:[\s\S]*?"([\s\S]*?)"/;
    
    const match = contextString.match(regex);
    
    if (match && match[1]) {
        // Membersihkan string hasil tangkapan:
        return match[1].replace(/\\n/g, ' ').replace(/\n/g, ' ').trim(); 
    }
    
    // Nilai default jika kunci tidak ditemukan.
    return 'Not available';
};

// -----------------------------------------------------------------
// HELPER SUMMARY FUNCTION (DIPINDAHKAN KE BACKEND)
// -----------------------------------------------------------------

const calculateSummaryMetrics = (engagements: Engagement[]): SummaryMetric[] => {
  if (engagements.length === 0) {
    return [
      { metric: 'Total Engagement Records', value: 0 },
      { metric: 'Most Frequent Type', value: 'N/A' },
    ];
  }

  const typeCounts = engagements.reduce((acc, e) => {
    const type = e.engagement || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let mostFrequentType = 'N/A';
  let maxCount = 0;
  
  for (const type in typeCounts) {
    if (typeCounts[type] > maxCount) {
      maxCount = typeCounts[type];
      mostFrequentType = `${type} (${maxCount})`;
    }
  }

  return [
    { metric: 'Total Engagement Records', value: engagements.length },
    { metric: 'Most Frequent Type', value: mostFrequentType },
  ];
};


// -----------------------------------------------------------------
// API HANDLER
// -----------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 1. FETCH PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();
    
    if (!profileData) {
      return res.status(404).json({ error: 'Profile not found or access denied.' });
    }
    
    const userBrandName = profileData.display_name;

    // 2. FETCH ENGAGEMENT
    const { data: engagementData, error: engagementError } = await supabase
      .from("Engagement")
      .select("sessionId, Brand, Scoring, Engagement, sessionContext") 
      .eq("Brand", userBrandName); 

    if (engagementError) {
      console.error("Supabase Error:", engagementError);
      return res.status(500).json({ error: 'Error fetching engagement data.' });
    }
    const mappedData = data.map((e) => ({
      ...e,
      sessionContext: e.sessionContext, 
      keyFact: extractMemoryMarker(e.sessionContext), 
      finalEvaluation: extractReasoning(e.sessionContext), // <-- FIX: Gunakan extractReasoning
    }));

    // 3. PROCESSING (Regex & Mapping)
    const processedData: Engagement[] = (engagementData || []).map((e: any) => ({
      sessionId: e.sessionId || 'N/A',
      brand: e.Brand,
      scoring: e.Scoring,
      engagement: e.Engagement,
      sessionContext: e.sessionContext, 
      keyFact: extractMemoryMarker(e.sessionContext), 
      finalEvaluation: extractMonitoringGuidance(e.sessionContext),
    }));

    // 4. SUMMARY CALCULATION (Di Server)
    const summaryMetrics = calculateSummaryMetrics(processedData); 

    // 5. Kirim data TERSTRUKTUR
    res.status(200).json({
      engagements: processedData,
      summary: summaryMetrics,
    });
    
  } catch (e) {
    console.error("Server Error:", e);
    res.status(500).json({ error: 'Internal server error during processing.' });
  }
}
