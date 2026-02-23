"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, BookOpen, BarChart3, Settings, Bot } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/resources", label: "Resources", icon: BookOpen },
  { href: "/admin/ai-jobs", label: "AI Jobs", icon: Bot },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.user_metadata?.role;
  const isAdmin = role === "super_admin" || role === "admin";

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-[80vh]">
      {/* Admin Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-500">VoiceSport Management</p>
            </div>
            <span className="ml-auto text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              {role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {ADMIN_NAV.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    active
                      ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
