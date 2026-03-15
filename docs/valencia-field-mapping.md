# VoiceSport Field Mapping: Valencia ↔ Dublin

> **Last updated:** 2026-03-15
> **Purpose:** Valencia'nın Supabase'e yazacağı ve Dublin'in okuyacağı field'ların tanımı.

---

## ai_transform_jobs

Valencia bu tabloya **yazıyor** (status güncellemeleri). Dublin bu tablodan **okuyor** (UI render).

| Field | Type | Writer | Reader | Description |
|-------|------|--------|--------|-------------|
| `id` | UUID | auto | Dublin | Primary key |
| `resource_id` | INTEGER | Dublin (create) | Valencia | FK → resources.id |
| `source_file_id` | UUID | Dublin (create) | Valencia | FK → resource_files.id, source dosya |
| `transform_type` | TEXT | Dublin (create) | Valencia | İş türü (aşağıdaki enum) |
| `status` | TEXT | Valencia (update) | Dublin | İş durumu (aşağıdaki enum) |
| `result_file_id` | UUID | Valencia (set) | Dublin | FK → resource_files.id, output dosya |
| `error_message` | TEXT | Valencia (set) | Dublin | Hata mesajı (status=error ise) |
| `requested_by` | TEXT | Dublin (create) | - | User id veya email |
| `pipeline_metadata` | JSONB | Valencia (set) | Dublin | Esnek metadata (aşağıda) |
| `created_at` | TIMESTAMP | auto | Dublin | Oluşturulma zamanı |
| `started_at` | TIMESTAMP | Valencia (set) | Dublin | İşleme başlama zamanı |
| `completed_at` | TIMESTAMP | Valencia (set) | Dublin | Tamamlanma zamanı |

### transform_type Enum

```
practitioner_brief   — 2 sayfa özet (Markdown/HTML)
audio_digest         — Sesli özet (MP3)
video_summary        — 3dk animasyonlu video (MP4)
flashcards           — Soru-cevap kartları (JSON)
mind_map             — Zihin haritası (SVG/PNG)
infographic          — Görsel infografik (PNG/PDF)
```

### status Flow

```
queued → processing → completed
                   → error
                   → cancelled
```

### pipeline_metadata (JSONB) — Valencia Yazıyor

```json
{
  "notebooklm_notebook_id": "nb_abc123",
  "processing_duration_ms": 45000,
  "retry_count": 0,
  "model_used": "notebooklm",
  "fallback_used": false,
  "output_format": "markdown",
  "output_language": "en"
}
```

---

## resource_files

Hem Dublin (source upload) hem Valencia (output) yazıyor.

| Field | Type | Writer | Reader | Description |
|-------|------|--------|--------|-------------|
| `id` | UUID | auto | Both | Primary key |
| `resource_id` | INTEGER | Dublin/Valencia | Both | FK → resources.id |
| `file_type` | TEXT | Dublin/Valencia | Both | Dosya kategorisi (aşağıdaki enum) |
| `file_path` | TEXT | Dublin/Valencia | Both | Supabase Storage path |
| `file_name` | TEXT | Dublin/Valencia | Both | Orijinal dosya adı |
| `file_size` | BIGINT | Dublin/Valencia | Both | Bayt cinsinden boyut |
| `mime_type` | TEXT | Dublin/Valencia | Both | MIME type |
| `created_at` | TIMESTAMP | auto | Both | Oluşturulma zamanı |

### file_type Enum

```
source               — Orijinal yüklenen dosya (Dublin yazar)
practitioner_brief   — Özet çıktısı (Valencia yazar)
audio_digest         — Ses dosyası (Valencia yazar)
video_summary        — Video dosyası (Valencia yazar)
flashcards           — JSON dosyası (Valencia yazar)
mind_map             — SVG/PNG dosyası (Valencia yazar)
infographic          — PNG/PDF dosyası (Valencia yazar)
```

### Storage Path Convention

```
resources/{resource_id}/{file_type}_{timestamp}.{ext}

Örnekler:
  resources/42/source_20260315.pdf
  resources/42/practitioner_brief_20260315.html
  resources/42/audio_digest_20260315.mp3
  resources/42/flashcards_20260315.json
```

---

## resource_analysis

Valencia yazıyor, Dublin okuyor.

| Field | Type | Writer | Reader | Description |
|-------|------|--------|--------|-------------|
| `id` | UUID | auto | Dublin | Primary key |
| `resource_id` | INTEGER | Valencia | Dublin | FK → resources.id |
| `executive_summary` | TEXT | Valencia | Dublin | Yönetici özeti |
| `key_findings` | JSONB | Valencia | Dublin | Temel bulgular |
| `target_audience_analysis` | JSONB | Valencia | Dublin | Hedef kitle analizi |
| `practical_implications` | JSONB | Valencia | Dublin | Pratik çıkarımlar |
| `raw_notebooklm_response` | JSONB | Valencia | - | Ham API yanıtı (debug) |
| `notebooklm_notebook_id` | TEXT | Valencia | - | NotebookLM notebook ID |
| `analysis_method` | TEXT | Valencia | Dublin | 'notebooklm' veya 'gemini' |
| `created_at` | TIMESTAMP | auto | Dublin | Oluşturulma zamanı |

### key_findings JSONB Format

```json
[
  {
    "finding": "Regular physical activity reduces anxiety by 30%",
    "evidence_level": "strong",
    "source_page": 12
  }
]
```

### target_audience_analysis JSONB Format

```json
{
  "primary": ["coaches", "PE teachers"],
  "secondary": ["club managers", "policy makers"],
  "relevance_notes": "Directly applicable to grassroots sport settings"
}
```

### practical_implications JSONB Format

```json
[
  {
    "implication": "Clubs should implement mental health screening",
    "action_items": ["Train coaches", "Partner with local health services"],
    "difficulty": "medium",
    "impact": "high"
  }
]
```

---

## Flashcards JSON Format (resource_files'da saklanır)

Valencia `flashcards` file_type ile resource_files'a JSON dosyası yazar.
Dublin bu JSON'u `Flashcards` component'ine aktarır.

```json
{
  "title": "EU Work Plan for Sport 2024-2027",
  "cards": [
    {
      "front": "What are the three priority areas of the EU Work Plan for Sport?",
      "back": "1. Integrity of sport\n2. Socio-economic dimension\n3. Sustainable development"
    }
  ],
  "total_cards": 15,
  "difficulty": "intermediate",
  "language": "en"
}
```

---

## Özet: Kim Neyi Yazıyor?

| Tablo | Dublin (Create) | Dublin (Read) | Valencia (Write) | Valencia (Read) |
|-------|----------------|---------------|-----------------|----------------|
| `resources` | ✅ metadata | ✅ | ❌ | ✅ resource_id |
| `resource_files` | ✅ source | ✅ all | ✅ outputs | ✅ source_file_id |
| `ai_transform_jobs` | ✅ create (queued) | ✅ status/results | ✅ status updates | ✅ job details |
| `resource_analysis` | ❌ | ✅ | ✅ | ❌ |
