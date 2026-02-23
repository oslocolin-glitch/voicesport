"use client";

import { Settings, Globe, Shield, Database, Bell } from "lucide-react";

const settingGroups = [
  {
    title: "General",
    icon: Globe,
    items: [
      { label: "Site Name", value: "VoiceSport", desc: "Displayed in navbar and meta tags" },
      { label: "Tagline", value: "European Sport Knowledge Hub", desc: "Shown below the logo" },
    ],
  },
  {
    title: "Access Control",
    icon: Shield,
    items: [
      { label: "Registration", value: "Open", desc: "Allow new users to sign up" },
      { label: "Resource Submission", value: "Authenticated", desc: "Who can submit resources" },
      { label: "AI Studio Access", value: "Authenticated", desc: "Who can use AI transformation tools" },
    ],
  },
  {
    title: "Integrations",
    icon: Database,
    items: [
      { label: "Supabase", value: "Pending", desc: "Database and auth connection" },
      { label: "OpenAI / Claude", value: "Not configured", desc: "AI transformation backend" },
      { label: "Storage Buckets", value: "Not created", desc: "File upload storage" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "New Submissions", value: "Off", desc: "Email admins on new resource submissions" },
      { label: "User Signups", value: "Off", desc: "Email admins on new user registrations" },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-violet-400" />
        Platform Settings
      </h2>

      <div className="space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
              <group.icon className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">{group.title}</span>
            </div>
            <div className="divide-y divide-gray-800/50">
              {group.items.map((item) => (
                <div key={item.label} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-6 text-center">Settings are read-only until Supabase is fully connected.</p>
    </div>
  );
}
