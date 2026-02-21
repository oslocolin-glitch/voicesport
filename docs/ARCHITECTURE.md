# VoiceSport — Teknik Mimari v1.0

**Tarih:** 21 Şubat 2026
**Durum:** TASLAK — Hakan onayı bekleniyor

---

## 1. Teknoloji Kararları

| Katman | Teknoloji | Neden? |
|--------|-----------|--------|
| **Frontend** | Next.js 15 (App Router) + TypeScript | SSR/SSG, SEO, Xfunding deneyimi |
| **UI** | Tailwind CSS + shadcn/ui | Hızlı geliştirme, dark mode, tutarlı tasarım |
| **Auth** | Supabase Auth | Google OAuth, email/password, rol yönetimi |
| **Database** | Supabase PostgreSQL | İlişkisel veri, full-text search, RLS |
| **Dosya Depolama** | Supabase Storage | PDF, video, infografik — S3 uyumlu |
| **AI Motoru** | OpenAI API (GPT-4o) + DeepL API | Özetleme, çeviri, dönüştürme |
| **Arama** | PostgreSQL tsvector + pg_trgm | Başlangıç için yeterli, sonra Typesense/Meilisearch |
| **Analytics** | Vercel Analytics + özel event tracking | Etki ölçümü dashboard |
| **Deploy** | Vercel | Xfunding ile aynı altyapı |
| **Domain** | voicesport.eu (veya .io) | Avrupa odaklı |

---

## 2. Veritabanı Şeması

```sql
-- ══════════ KULLANICILAR ══════════
-- Supabase Auth handles users, we extend with profiles

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT DEFAULT 'consumer', -- consumer | provider | editor | admin
  user_type TEXT, -- coach | club_manager | athlete | educator | researcher | policy_maker
  sports TEXT[], -- ['Football', 'Athletics']
  country_code TEXT,
  languages TEXT[], -- ['EN', 'TR', 'NO']
  interests TEXT[], -- ['Safeguarding', 'Dual Career']
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════ İÇERİKLER ══════════

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  -- Temel bilgiler
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT, -- kısa açıklama
  abstract TEXT, -- uzun açıklama
  -- Sınıflandırma
  resource_type TEXT NOT NULL, -- report | guide | toolkit | platform | dataset | policy
  topics TEXT[] NOT NULL, -- ['Safeguarding', 'Club Management']
  sports TEXT[], -- ['Football', 'Multi-sport']
  target_audiences TEXT[], -- ['coach', 'club_manager', 'athlete']
  -- Kaynak proje
  project_name TEXT,
  funding_source TEXT, -- 'Erasmus+ Sport KA2'
  partner_countries TEXT[], -- ['ES', 'DE', 'TR']
  project_year INT,
  -- Meta
  languages TEXT[] DEFAULT '{"EN"}',
  license TEXT DEFAULT 'CC BY 4.0', -- CC BY | CC BY-SA | CC BY-NC
  page_count INT,
  -- Durumlar
  status TEXT DEFAULT 'pending', -- pending | review | published | archived
  featured BOOLEAN DEFAULT FALSE,
  -- İstatistikler (denormalized, trigger ile güncellenir)
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  applied_count INT DEFAULT 0, -- "sahada uyguladım" sayısı (North Star)
  -- Yükleyen
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  -- Tarihler
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
ALTER TABLE resources ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'C')
  ) STORED;
CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);
CREATE INDEX idx_resources_topics ON resources USING GIN(topics);
CREATE INDEX idx_resources_sports ON resources USING GIN(sports);
CREATE INDEX idx_resources_status ON resources(status);

-- ══════════ DOSYALAR ══════════

CREATE TABLE resource_files (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  -- Dosya bilgisi
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf | docx | mp4 | png | url | mp3
  file_size BIGINT, -- bytes
  storage_path TEXT, -- Supabase Storage path
  external_url TEXT, -- harici link ise
  -- Format kategorisi
  format_label TEXT, -- 'PDF Report', 'Video Summary', 'Infographic', 'Podcast'
  is_original BOOLEAN DEFAULT TRUE, -- orijinal mi, AI dönüştürme mi?
  language TEXT DEFAULT 'EN',
  -- AI dönüştürme bilgisi
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_transform_type TEXT, -- summary | infographic | video | audio | translation
  ai_source_file_id INT REFERENCES resource_files(id),
  --
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════ DEĞERLENDİRMELER ══════════

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  applied_in_practice BOOLEAN DEFAULT FALSE, -- North Star!
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- ══════════ KOLEKSİYONLAR ══════════

CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_items (
  collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, resource_id)
);

-- ══════════ TOPLULUKLAR ══════════

CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT, -- emoji
  description TEXT,
  member_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_members (
  community_id INT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

-- ══════════ UYGULAYICI HİKAYELERİ ══════════

CREATE TABLE practice_stories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  resource_id INT REFERENCES resources(id),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  country_code TEXT,
  sport TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════ ANALİTİK OLAYLAR ══════════

CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL, -- view | download | search | ai_transform | share
  resource_id INT REFERENCES resources(id),
  user_id UUID REFERENCES profiles(id),
  metadata JSONB, -- { query, filters, format, language, etc. }
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_resource ON analytics_events(resource_id);

-- ══════════ AI DÖNÜŞTÜRME KUYRUĞU ══════════

CREATE TABLE ai_transform_jobs (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id),
  source_file_id INT NOT NULL REFERENCES resource_files(id),
  transform_type TEXT NOT NULL, -- summary | infographic | video | audio | translation
  target_language TEXT, -- for translations
  status TEXT DEFAULT 'queued', -- queued | processing | completed | failed
  result_file_id INT REFERENCES resource_files(id),
  error_message TEXT,
  requested_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

---

## 3. Supabase Storage Buckets

| Bucket | Erişim | İçerik |
|--------|--------|--------|
| `resources` | Public (read), Auth (write) | PDF, DOCX, toolkit dosyaları |
| `transformed` | Public (read) | AI üretimi: özetler, infografikler, ses |
| `videos` | Public (read) | Video özetler (MP4) |
| `avatars` | Public (read), Auth (write) | Kullanıcı profil fotoları |

---

## 4. API Route Yapısı

```
/api/
├── resources/
│   ├── route.ts          — GET (list/search), POST (submit)
│   └── [id]/
│       ├── route.ts      — GET (detail), PATCH (edit), DELETE
│       ├── review/route.ts  — POST (puan/yorum)
│       └── download/route.ts — GET (dosya indirme + analytics)
├── ai/
│   ├── transform/route.ts   — POST (dönüştürme başlat)
│   ├── status/[jobId]/route.ts — GET (iş durumu)
│   └── translate/route.ts   — POST (çeviri)
├── collections/
│   ├── route.ts          — GET, POST
│   └── [id]/route.ts     — PATCH, DELETE
├── communities/
│   ├── route.ts          — GET (list)
│   └── [id]/
│       ├── route.ts      — GET (detail)
│       └── join/route.ts — POST, DELETE
├── stories/
│   ├── route.ts          — GET, POST
│   └── [id]/route.ts     — GET
├── analytics/
│   ├── dashboard/route.ts — GET (platform stats)
│   ├── resource/[id]/route.ts — GET (proje etki raporu)
│   └── track/route.ts    — POST (event tracking)
├── admin/
│   ├── resources/route.ts — GET (review queue), PATCH (approve/reject)
│   ├── users/route.ts     — GET, PATCH, DELETE
│   └── stats/route.ts     — GET
└── profile/
    └── route.ts           — GET, PATCH
```

---

## 5. Sayfa Yapısı (App Router)

```
/app/
├── page.tsx                    — Landing / Discover (ana sayfa)
├── resource/[slug]/page.tsx    — Kaynak detay
├── submit/page.tsx             — İçerik yükleme (5 adım)
├── ai-studio/page.tsx          — AI Dönüştürme Stüdyosu
├── dashboard/page.tsx          — Etki Dashboard
├── communities/
│   ├── page.tsx                — Topluluk listesi
│   └── [slug]/page.tsx         — Topluluk detay
├── stories/page.tsx            — Uygulayıcı hikayeleri
├── search/page.tsx             — Gelişmiş arama
├── collections/page.tsx        — Koleksiyonlarım
├── profile/
│   ├── page.tsx                — Profil görüntüleme/düzenleme
│   └── [id]/page.tsx           — Başkasının profili
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── callback/route.ts
│   └── profile/page.tsx
├── admin/
│   ├── page.tsx                — Admin dashboard
│   ├── resources/page.tsx      — İçerik onay kuyruğu
│   └── users/page.tsx          — Kullanıcı yönetimi
├── okr/page.tsx                — OKR Dashboard
└── pricing/page.tsx            — Kurumsal abonelikler
```

---

## 6. Geliştirme Fazları

### Faz 1 — MVP (2-3 hafta)
**Hedef:** Çalışan platform, içerik keşfi, temel yükleme

- [x] Next.js proje kurulumu + Supabase bağlantısı
- [ ] DB şeması oluştur (Supabase SQL Editor)
- [ ] Auth (Supabase — email + Google OAuth)
- [ ] Profil oluşturma (rol seçimi, spor, dil)
- [ ] Discover sayfası (arama, filtre, içerik kartları)
- [ ] Kaynak detay sayfası
- [ ] Submit flow (5 adım — dosya yükleme)
- [ ] Admin: içerik onay kuyruğu
- [ ] Temel analytics tracking (view, download)
- [ ] Responsive mobil tasarım
- [ ] Vercel'e deploy

### Faz 2 — AI & Topluluk (3-4 hafta)
**Hedef:** AI dönüştürme, topluluk özellikleri

- [ ] AI Dönüştürme Stüdyosu (özet, çeviri)
- [ ] OpenAI API entegrasyonu (GPT-4o)
- [ ] DeepL API çeviri entegrasyonu
- [ ] Değerlendirme sistemi (puan + yorum + "uyguladım")
- [ ] Koleksiyonlar
- [ ] Uygulayıcı hikayeleri
- [ ] Tematik topluluklar
- [ ] Email bildirimleri

### Faz 3 — Dashboard & Ölçek (2-3 hafta)
**Hedef:** Etki ölçümü, OKR, kişiselleştirme

- [ ] Impact Dashboard (platform + proje düzeyi)
- [ ] OKR Dashboard (faz bazlı tracking)
- [ ] Proje etki raporu (otomatik PDF)
- [ ] Kişiselleştirilmiş öneriler ("Senin için")
- [ ] Gelişmiş arama (doğal dil, semantic)
- [ ] Çok dilli arayüz (EN, TR, NO)
- [ ] Premium kurumsal özellikler
- [ ] API erişimi

---

## 7. Entegrasyonlar

| Sistem | Entegrasyon | Faz |
|--------|------------|-----|
| **Sportera** | Çapraz link, mikro-öğrenme kartları | 2 |
| **SF4Sport** | Trend verisi besleme | 3 |
| **Erasmus+ Results Platform** | Proje verisi import | 1 |
| **DeepL** | Çeviri API | 2 |
| **OpenAI** | Özetleme, dönüştürme | 2 |

---

## 8. Güvenlik & Performans

- **RLS (Row Level Security):** Tüm tablolarda Supabase RLS aktif
- **Rate Limiting:** API'lerde IP + user bazlı limit
- **Dosya Boyutu:** Max 500MB/dosya, toplam 5GB/kullanıcı
- **CDN:** Vercel Edge + Supabase CDN (dosyalar için)
- **Caching:** ISR (Incremental Static Regeneration) kaynak sayfalarında
- **GDPR:** Kullanıcı verisi silme, veri export, cookie consent

---

*Bu belge geliştirme sürecinde güncellenecektir.*
