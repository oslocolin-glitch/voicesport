"use client";

import { useAuth } from "@/components/AuthProvider";
import { User, Mail, Shield, LogOut, Calendar, Settings, BookOpen, Upload, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [stats] = useState({ resources: 0, transforms: 0, communities: 0 });

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const meta = user.user_metadata || {};
  const email = user.email || "";
  const displayName = meta.display_name || meta.full_name || email.split("@")[0];
  const initials = displayName.substring(0, 2).toUpperCase();
  const role = meta.role || "user";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const provider = user.app_metadata?.provider || "email";

  const roleBadge: Record<string, { label: string; class: string }> = {
    super_admin: { label: "Super Admin", class: "bg-red-500/15 text-red-400 border-red-500/30" },
    admin: { label: "Admin", class: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
    moderator: { label: "Moderator", class: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    user: { label: "Member", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  };
  const badge = roleBadge[role] || roleBadge.user;

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mb-4 ring-4 ring-emerald-500/20">
            {initials}
          </div>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-sm text-gray-400 mt-1">{email}</p>
          <div className="mt-3">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badge.class}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: BookOpen, label: "Resources", value: stats.resources },
            { icon: Bot, label: "AI Transforms", value: stats.transforms },
            { icon: Upload, label: "Submissions", value: stats.communities },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <s.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Details</h2>
          {[
            { icon: Mail, label: "Email", value: email },
            { icon: User, label: "Display Name", value: displayName },
            { icon: Shield, label: "Role", value: badge.label },
            { icon: Calendar, label: "Member Since", value: createdAt },
            { icon: Settings, label: "Auth Provider", value: provider.charAt(0).toUpperCase() + provider.slice(1) },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-gray-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Link */}
        {(role === "super_admin" || role === "admin") && (
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/25 transition mb-3"
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </Link>
        )}

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
