export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  abstract: string | null;
  resource_type: string;
  topics: string[];
  sports: string[];
  target_audiences: string[];
  project_name: string | null;
  funding_source: string | null;
  partner_countries: string[];
  project_year: number | null;
  languages: string[];
  license: string;
  page_count: number | null;
  status: "pending" | "review" | "published" | "archived";
  featured: boolean;
  view_count: number;
  download_count: number;
  rating_avg: number;
  rating_count: number;
  applied_count: number;
  submitted_by: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ResourceFile {
  id: number;
  resource_id: number;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string | null;
  external_url: string | null;
  format_label: string | null;
  is_original: boolean;
  language: string;
  ai_generated: boolean;
  ai_transform_type: string | null;
  download_count: number;
}

export interface Review {
  id: number;
  resource_id: number;
  user_id: string;
  rating: number;
  comment: string | null;
  applied_in_practice: boolean;
  created_at: string;
  // joined
  display_name?: string;
  user_type?: string;
  country_code?: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  role: string;
  user_type: string | null;
  sports: string[];
  country_code: string | null;
  languages: string[];
  interests: string[];
  organization: string | null;
  avatar_url: string | null;
}

export interface Community {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  member_count: number;
}

export interface PracticeStory {
  id: number;
  user_id: string;
  resource_id: number | null;
  title: string;
  story: string;
  country_code: string | null;
  sport: string | null;
  verified: boolean;
  created_at: string;
  // joined
  display_name?: string;
  user_type?: string;
}
