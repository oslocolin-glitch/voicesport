"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Search, Upload, Bot, BarChart3, Users, LogOut, User, ChevronDown, Menu, X, Shield } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Discover" },
  { href: "/submit", label: "Submit" },
  { href: "/ai-studio", label: "AI Studio" },
  { href: "/dashboard", label: "Impact" },
  { href: "/communities", label: "Community" },
];

function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition font-medium">Sign In</Link>
        <Link href="/auth/signup" className="text-sm bg-white text-black px-4 py-2 rounded-full transition font-medium hover:bg-gray-200">Join Free</Link>
      </div>
    );
  }

  const email = user.email || "";
  const name = user.user_metadata?.display_name || user.user_metadata?.full_name || email.split("@")[0];
  const initials = name.substring(0, 2).toUpperCase();
  const role = user.user_metadata?.role;
  const isAdmin = role === "super_admin" || role === "admin";

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/[0.06] transition">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl p-1.5 overflow-hidden">
            <div className="px-3 py-2.5 mb-1">
              <p className="text-sm font-medium text-white truncate">{name}</p>
              <p className="text-[11px] text-gray-500 truncate">{email}</p>
            </div>
            <div className="h-px bg-white/[0.06] mx-2 mb-1" />
            <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/[0.06] rounded-xl transition" onClick={() => setOpen(false)}>
              <User className="w-4 h-4 text-gray-500" /> Profile
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 text-sm text-violet-400 hover:bg-violet-500/10 rounded-xl transition" onClick={() => setOpen(false)}>
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <div className="h-px bg-white/[0.06] mx-2 my-1" />
            <button onClick={() => { setOpen(false); signOut(); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on admin pages (admin has its own layout)
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-[980px] mx-auto px-6 flex items-center h-12 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-extrabold">V</div>
          <span className="font-semibold text-white text-sm tracking-tight hidden sm:inline">VoiceSport</span>
        </Link>

        {/* Desktop nav — Apple style: compact, centered text links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs font-medium transition ${active ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block"><UserMenu /></div>
          <button className="md:hidden text-gray-400 p-1.5" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-black/95 backdrop-blur-xl px-6 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/[0.05]"><UserMenu /></div>
        </div>
      )}
    </header>
  );
}
