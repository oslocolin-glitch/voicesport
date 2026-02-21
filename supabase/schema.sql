-- ══════════ VoiceSport DB Schema ══════════

-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT DEFAULT 'consumer',
  user_type TEXT,
  sports TEXT[] DEFAULT '{}',
  country_code TEXT,
  languages TEXT[] DEFAULT '{EN}',
  interests TEXT[] DEFAULT '{}',
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, organization, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'user_type'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Resources
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  abstract TEXT,
  resource_type TEXT NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  sports TEXT[] DEFAULT '{}',
  target_audiences TEXT[] DEFAULT '{}',
  project_name TEXT,
  funding_source TEXT,
  partner_countries TEXT[] DEFAULT '{}',
  project_year INT,
  languages TEXT[] DEFAULT '{EN}',
  license TEXT DEFAULT 'CC BY 4.0',
  page_count INT,
  status TEXT DEFAULT 'pending',
  featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  applied_count INT DEFAULT 0,
  submitted_by UUID REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search
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
CREATE INDEX idx_resources_slug ON resources(slug);

-- Resource files
CREATE TABLE resource_files (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  storage_path TEXT,
  external_url TEXT,
  format_label TEXT,
  is_original BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'EN',
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_transform_type TEXT,
  ai_source_file_id INT REFERENCES resource_files(id),
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  applied_in_practice BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Collections
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

-- Communities
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
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

-- Practice stories
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

-- Analytics events
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  resource_id INT REFERENCES resources(id),
  user_id UUID REFERENCES profiles(id),
  metadata JSONB,
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_resource ON analytics_events(resource_id);

-- AI transform jobs
CREATE TABLE ai_transform_jobs (
  id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL REFERENCES resources(id),
  source_file_id INT NOT NULL REFERENCES resource_files(id),
  transform_type TEXT NOT NULL,
  target_language TEXT,
  status TEXT DEFAULT 'queued',
  result_file_id INT REFERENCES resource_files(id),
  error_message TEXT,
  requested_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ══════════ RLS Policies ══════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Resources: published ones are public, own submissions visible
CREATE POLICY "Published resources are viewable" ON resources FOR SELECT USING (status = 'published' OR submitted_by = auth.uid());
CREATE POLICY "Auth users can insert resources" ON resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own resources" ON resources FOR UPDATE USING (submitted_by = auth.uid());

-- Resource files: follow resource visibility
CREATE POLICY "Resource files are viewable" ON resource_files FOR SELECT USING (true);

-- Reviews: public read, auth write
CREATE POLICY "Reviews are viewable" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Collections: own collections
CREATE POLICY "Users see own collections" ON collections FOR SELECT USING (user_id = auth.uid() OR is_public = true);
CREATE POLICY "Users can create collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Collection items viewable" ON collection_items FOR SELECT USING (true);
CREATE POLICY "Users can add to own collections" ON collection_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND user_id = auth.uid())
);

-- Communities: public
CREATE POLICY "Communities are viewable" ON communities FOR SELECT USING (true);
CREATE POLICY "Community members viewable" ON community_members FOR SELECT USING (true);
CREATE POLICY "Users can join communities" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON community_members FOR DELETE USING (auth.uid() = user_id);

-- Practice stories: public read
CREATE POLICY "Stories are viewable" ON practice_stories FOR SELECT USING (true);
CREATE POLICY "Auth users can share stories" ON practice_stories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics: insert only
CREATE POLICY "Anyone can track events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read analytics" ON analytics_events FOR SELECT USING (auth.uid() IS NOT NULL);

-- ══════════ Seed Data: Communities ══════════
INSERT INTO communities (slug, name, icon, description, member_count) VALUES
  ('safeguarding', 'Safeguarding Network', '🛡️', 'Best practices for child and athlete protection in sport.', 0),
  ('dual-career', 'Dual Career Community', '🎓', 'Supporting athletes balancing sport and education.', 0),
  ('ai-sport', 'AI in Sport Innovators', '🤖', 'Exploring AI applications in coaching, analytics and education.', 0),
  ('green-sport', 'Green Sport Alliance', '🌿', 'Sustainable practices for sport organisations.', 0),
  ('inclusive-sport', 'Inclusive Sport Hub', '♿', 'Making sport accessible for all abilities.', 0),
  ('coach-dev', 'Coach Development Circle', '🏋️', 'Professional development resources for coaches at all levels.', 0),
  ('women-sport', 'Women in Sport Forum', '🏃‍♀️', 'Gender equality and empowerment in sport.', 0),
  ('governance', 'Good Governance Network', '🏛️', 'Transparency, accountability and ethics in sport management.', 0);

-- ══════════ Seed Data: Sample Resources ══════════
INSERT INTO resources (title, slug, description, abstract, resource_type, topics, sports, target_audiences, project_name, funding_source, partner_countries, project_year, languages, license, page_count, status, featured, view_count, download_count, rating_avg, rating_count, applied_count, published_at) VALUES
  ('Safeguarding Policy Toolkit for Grassroots Clubs', 'safeguarding-toolkit', 'A comprehensive toolkit for grassroots sport clubs to develop, implement and monitor safeguarding policies.', 'A comprehensive toolkit for grassroots sport clubs to develop, implement and monitor safeguarding policies. Covers policy templates, training modules and implementation guides.', 'Toolkit', '{Safeguarding}', '{Football}', '{coach,club_manager}', 'SafeClub 2024', 'Erasmus+ Sport KA2', '{ES,DE,TR}', 2024, '{EN,ES,DE,TR}', 'CC BY-SA 4.0', 80, 'published', true, 2340, 890, 4.7, 34, 34, '2024-06-15'),
  ('AI-Powered Adaptive Learning for Coach Education', 'ai-coach-education', 'Research report on implementing AI-driven personalized learning pathways in coach education.', 'Research report on implementing AI-driven personalized learning pathways in coach education. Includes case studies from Netherlands and Norway.', 'Report', '{AI & Education}', '{Multi-sport}', '{educator,coach}', 'COMPATH 2', 'Erasmus+ Sport KA2', '{NL,NO}', 2025, '{EN,NO,NL}', 'CC BY 4.0', 120, 'published', false, 1890, 654, 4.5, 18, 18, '2025-01-20'),
  ('Dual Career Support: Athlete-Student Balance Guide', 'dual-career-guide', 'Practical guide for athletes, coaches and university administrators on balancing sport with studies.', 'Practical guide for athletes, coaches and university administrators on balancing sport with studies. Based on research across Italy, Belgium and Finland.', 'Guide', '{Dual Career}', '{Athletics}', '{athlete,educator}', 'EAS Network', 'Erasmus+ Sport KA2', '{IT,BE,FI}', 2024, '{EN,IT,FI,FR}', 'CC BY 4.0', 45, 'published', true, 3120, 1450, 4.8, 52, 52, '2024-09-10'),
  ('Green Sport Management: Carbon Footprint Toolkit', 'green-sport-toolkit', 'Tools for sport organizations to measure, reduce and report their environmental footprint.', 'Tools for sport organizations to measure, reduce and report their environmental footprint. Includes carbon calculator app and reporting templates.', 'Toolkit', '{Green Sport}', '{Multi-sport}', '{club_manager}', 'GAMES Erasmus+', 'Erasmus+ Sport KA2', '{DE,SE}', 2025, '{EN,DE,SV}', 'CC BY-SA 4.0', 60, 'published', false, 1560, 520, 4.3, 12, 12, '2025-02-01'),
  ('Inclusive Sport Innovation Lab: Disability & Access', 'inclusive-sport-lab', 'Interactive platform with adapted training methodologies and policy frameworks for accessible sport.', 'Interactive platform with adapted training methodologies and policy frameworks for accessible sport. Covers physical, intellectual and sensory disabilities.', 'Platform', '{Inclusive Sport}', '{Multi-sport}', '{coach,club_manager,policy_maker}', 'SportAccess+', 'Erasmus+ Sport KA2', '{PT,PL,IE}', 2024, '{EN,PT,PL}', 'CC BY 4.0', 95, 'published', true, 2780, 980, 4.9, 41, 41, '2024-11-05'),
  ('Padel Development Framework for Europe', 'padel-framework', 'Strategic framework for developing padel across European countries.', 'Strategic framework for developing padel across European countries. Covers infrastructure, coaching, competition and governance recommendations.', 'Report', '{Sport Development}', '{Padel}', '{policy_maker,club_manager}', 'PADEL-EURO', 'Erasmus+ Sport KA2', '{ES,TR,SE}', 2026, '{EN,ES,TR,SV}', 'CC BY 4.0', 55, 'published', false, 1230, 410, 4.4, 8, 8, '2026-01-15');
