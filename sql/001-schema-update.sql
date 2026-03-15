-- VoiceSport Faz 1: Schema Update
-- Run in Supabase SQL Editor

-- 1. Attribution fields on resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS original_author TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS original_organisation TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'CC-BY-4.0';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS funding_acknowledgement TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS grant_number TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS permission_status TEXT DEFAULT 'self_uploaded';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS permission_notes TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS attribution_text TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- 2. Resource files table (source uploads + pipeline outputs)
CREATE TABLE IF NOT EXISTS resource_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,          -- 'source', 'practitioner_brief', 'audio_digest', etc.
  file_path TEXT NOT NULL,          -- Supabase Storage path
  file_name TEXT,                   -- Original filename
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. AI transform jobs table (Valencia pipeline coordination)
CREATE TABLE IF NOT EXISTS ai_transform_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  source_file_id UUID REFERENCES resource_files(id) ON DELETE SET NULL,
  transform_type TEXT NOT NULL,     -- practitioner_brief, audio_digest, video_summary, flashcards, mind_map, infographic
  status TEXT NOT NULL DEFAULT 'queued', -- queued → processing → completed → error → cancelled
  result_file_id UUID REFERENCES resource_files(id) ON DELETE SET NULL,
  error_message TEXT,
  requested_by TEXT,                -- user id or email
  pipeline_metadata JSONB,         -- notebooklm notebook_id, processing stats, retry count etc.
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- 4. Resource analysis table (Valencia deep analysis outputs)
CREATE TABLE IF NOT EXISTS resource_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  executive_summary TEXT,
  key_findings JSONB,
  target_audience_analysis JSONB,
  practical_implications JSONB,
  raw_notebooklm_response JSONB,
  notebooklm_notebook_id TEXT,
  analysis_method TEXT DEFAULT 'notebooklm',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_transform_jobs_resource ON ai_transform_jobs(resource_id);
CREATE INDEX IF NOT EXISTS idx_transform_jobs_status ON ai_transform_jobs(status);
CREATE INDEX IF NOT EXISTS idx_resource_files_resource ON resource_files(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_analysis_resource ON resource_analysis(resource_id);

-- 6. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;
