# ANCHOR — AI-Native Contextual Hyper-Optimized Recommendations

## 🚀 Apa itu ANCHOR?

ANCHOR adalah **lapisan monetisasi AI** yang memungkinkan aplikasi AI menghasilkan uang tanpa perlu menarik biaya dari pengguna.

Caranya: dengan memberikan rekomendasi produk yang kontekstual, muncul hanya ketika relevan, dan terasa seperti saran natural dalam percakapan dan bukan iklan yang mengganggu.

Sederhananya:
➡️ AI berbicara seperti biasa, dan ketika ada momen yang tepat, ANCHOR menawarkan rekomendasi yang benar-benar membantu.
### ANCHOR Demo
- Video Demo -> https://drive.google.com/file/d/1wXzCrAF8AsxqOeRG0jD3DMbzIPyFLDea/view?usp=drive_link 
- Demo Sebagai User AI Chatbot -> https://infinite-ai-nine.vercel.app/ ( Repo Github : https://github.com/noperi11/infinite-ai)
- Demo Sebagai Brand Pengiklan -> https://anchor-ochre.vercel.app/ ( Untuk Login Gunakan id : adidas@gmail.com, pass : adidas )
## 💡 Kenapa ANCHOR Dibuat?

AI berkembang sangat cepat — pengguna bertambah banyak, tetapi keinginan membayar turun drastis.

Masalah yang muncul di banyak aplikasi AI:

- Pengguna tidak ingin bayar subscription

- Biaya inference model makin mahal

- Iklan digital tradisional makin mengganggu

- Developer sulit bertahan hidup secara bisnis

ANCHOR hadir sebagai solusi baru:
Monetisasi tanpa mengorbankan kenyamanan dan kepercayaan pengguna.

## 🏅 Tech-Stack Yang Digunakan
- Framework Next.js
- Typescript
- React Frontend
- Tailwind
- Database SUPABASE 
- n8n AI Agents
- RAG
## 🔄 Integrasi Backend dengan n8n

Project ini menggunakan **n8n** sebagai backend automation layer untuk menangani proses-proses server-side seperti penyimpanan engagement, trigger event, pemrosesan data, serta integrasi dengan SUPABASE.

---

## 🧠 Peran n8n di Project ini

n8n digunakan sebagai backend untuk:

- Override AI ketika ada sales opportunity
- Menyimpan engagement user
- Menghitung scoring rekomendasi
- Membaca konteks percakapan
- Menentukan waktu yang tepat untuk memberikan link
- Integrasi third-party AP

Dengan n8n, project ini memanfaatkan workflow backend yang lebih fleksibel, cepat dibuat, dan mudah dimaintain tanpa perlu memodifikasi kode di sisi frontend atau server.

## 💎 Output Json dari n8n
```json
{
  "sessionContext": {
    "session_context": {
      "primary_topic": "Kobe2",
      "secondary_topics": "",
      "conversation_type": "advice_seeking",
      "emotional_trajectory": "stable",
      "current_emotional_state": "neutral",
      "engagement_intensity": "medium"
    },
    "user_persona_update": {
      "confidence_level": 0.7,
      "new_insights": "interest_in_sports_footwear",
      "desire_for_direct_links": true,
      "updated_attributes": {
        "interests": "Kobe2_sneakers",
        "pain_points": "access_to_product_links",
        "values": "convenience"
      }
    },
    "opportunity_signals": {
      "category": "footwear",
      "signal_strength": "moderate",
      "trigger_phrase": "tolong berikan link nya untuk Kobe2",
      "contextual_need": "access_to_product_information",
      "timing_appropriateness": "now",
      "rationale": "user explicitly requests link"
    },
    "conversation_health": {
      "trust_level": "building",
      "receptivity_to_suggestions": "open",
      "ethical_considerations": "none",
      "recommendation_readiness": "maybe"
    },
    "memory_markers": {
      "key_facts_to_remember": "interest_in_Kobe2",
      "follow_up_topics": "none",
      "preferences_expressed": "explicit_request_for_link"
    }
  },

  "Scoring": {
    "dimensionScores": {
      "relevanceScore": 9.5,
      "timingScore": 9.5,
      "emotionalReceptivityScore": 8.0,
      "trustLevelScore": 5.5,
      "intentClarityScore": 9.5,
      "valueAlignmentScore": 8.5,
      "nonDisruptionScore": 9.5
    },
    "compositeOMSScore": 8.55,
    "confidenceLevel": "high",
    "decision": "proceed",
    "veto": false,
    "reasoning": "The user explicitly requests a direct link to Kobe2 sneakers, indicating a crystal-clear intent and strong relevance. Timing is optimal as the request is made now, and the user's emotional state is neutral with open receptivity. Trust is still building but sufficient for a recommendation, and the suggestion aligns well with the user's value of convenience. Integration of the link is natural and non-disruptive.",
    "monitoringGuidance": "After providing the link, observe if the user engages with the content or expresses satisfaction. Continue to reinforce trust and watch for any shift in emotional state or receptivity.",
    "final": true
  },

  "Engagement": "consent",

  "Brand": "Adidas"
}

```

## ✨ Instalasi
### 🌐 Skema DB SUPABASE
Pastikan Tables,Foreign Key dan Primary Key seperti berikut :
<img width="883" height="617" alt="image" src="https://github.com/user-attachments/assets/3681d9d2-13fb-43af-bd6a-099a6316234b" />
### ♾ Skema n8n
**ANCHOR LAYER**
<img width="1469" height="700" alt="image" src="https://github.com/user-attachments/assets/694166d6-0abf-44c9-96de-0bdd216a180a" />
**ANCHOR ANALYZER**
<img width="1483" height="697" alt="image" src="https://github.com/user-attachments/assets/e4d2ef2b-a655-4161-a43b-833fea4ca3e8" />
**RAG STATION**
<img width="1470" height="700" alt="image" src="https://github.com/user-attachments/assets/e295ef8a-a3b7-4c0a-9677-394845523c10" />

### ♦️ Langkah-langkah untuk menginstal atau meng-setup project secara lokal:

```bash
git clone https://github.com/noperi11/anchor.git
cd anchor
npm install --save-dev typescript @types/react 
```

Lalu setup .env
```
SUPABASE_URL = "URL SUPABASE KAMU"
SUPABASE_SERVICE_ROLE_KEY = "SERVICE ROLE KEY SUPABASE KAMU"
NEXT_PUBLIC_SUPABASE_URL = "URL SUPABASE KAMU"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "ANON KEY SUPABASE KAMU"
```
Build Appnya
```
npm run build
```
Lalu Jalankan
```
npm run dev
```
