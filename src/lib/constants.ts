export const TOPICS = [
  "Safeguarding", "AI & Education", "Dual Career", "Green Sport",
  "Inclusive Sport", "Sport Development", "Good Governance", "Coach Development",
  "Women in Sport", "Anti-doping", "Mental Health", "Physical Literacy",
  "Esports", "Sport Diplomacy", "Volunteering",
] as const;

export const RESOURCE_TYPES = [
  "Report", "Guide", "Toolkit", "Platform", "Dataset", "Policy", "Video", "App",
] as const;

export const TARGET_AUDIENCES = [
  { key: "coach", label: "Coach", icon: "🏃" },
  { key: "club_manager", label: "Club Manager", icon: "🏢" },
  { key: "athlete", label: "Athlete", icon: "⚡" },
  { key: "educator", label: "Educator", icon: "📚" },
  { key: "researcher", label: "Researcher", icon: "🔬" },
  { key: "policy_maker", label: "Policy Maker", icon: "🏛️" },
] as const;

export const SPORTS = [
  "Multi-sport", "Football", "Athletics", "Swimming", "Basketball", "Tennis",
  "Padel", "Volleyball", "Handball", "Cycling", "Gymnastics", "Rugby",
  "Ice Hockey", "Skiing", "Rowing", "Judo", "Fencing", "Other",
] as const;

export const FORMAT_ICONS: Record<string, string> = {
  "PDF": "📄", "Video": "🎬", "Infographic": "🖼️", "Practitioner Brief": "📝",
  "Micro-learning": "📱", "Quiz": "❓", "App": "📲", "Platform": "🖥️",
  "Podcast": "🎧", "Audio": "🎧", "DOCX": "📄",
};

export const FLAG_MAP: Record<string, string> = {
  AT: "🇦🇹", BE: "🇧🇪", BG: "🇧🇬", CY: "🇨🇾", CZ: "🇨🇿", DE: "🇩🇪", DK: "🇩🇰",
  EE: "🇪🇪", ES: "🇪🇸", FI: "🇫🇮", FR: "🇫🇷", GR: "🇬🇷", HR: "🇭🇷", HU: "🇭🇺",
  IE: "🇮🇪", IT: "🇮🇹", LT: "🇱🇹", LU: "🇱🇺", LV: "🇱🇻", MT: "🇲🇹", NL: "🇳🇱",
  NO: "🇳🇴", PL: "🇵🇱", PT: "🇵🇹", RO: "🇷🇴", SE: "🇸🇪", SI: "🇸🇮", SK: "🇸🇰",
  TR: "🇹🇷", UK: "🇬🇧", EN: "🇬🇧",
};

export const LICENSES = ["CC BY 4.0", "CC BY-SA 4.0", "CC BY-NC 4.0"] as const;
