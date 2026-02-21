"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Search, Upload, Bot, BarChart3, Users, LogOut, User, ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Discover", icon: Search },
  { href: "/submit", label: "Submit", icon: Upload },
  { href: "/ai-studio", label: "AI Studio", icon: Bot },
  { href: "/dashboard", label: "Impact", icon: BarChart3 },
  { href: "/communities", label: "Community", icon: Users },
];

function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg transition font-medium">Sign In</Link>
        <Link href="/auth/signup" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition font-medium">Join Free</Link>
      </div>
    );
  }

  const email = user.email || "";
  const name = user.user_metadata?.display_name || email.split("@")[0];
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-2">
            <div className="px-3 py-2 border-b border-gray-800 mb-1">
              <p className="text-sm font-medium text-white truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>
            <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition" onClick={() => setOpen(false)}>
              <User className="w-4 h-4" /> Profile
            </Link>
            <button onClick={() => { setOpen(false); signOut(); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition">
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

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-lg font-extrabold font-[Outfit]">V</div>
          <div>
            <div className="font-bold text-white text-lg tracking-tight leading-tight">VoiceSport</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-[2px]">European Sport Knowledge Hub</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block"><UserMenu /></div>
          <button className="md:hidden text-gray-300 p-2" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B1120] px-4 py-3 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg">
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10"><UserMenu /></div>
        </div>
      )}
    </header>
  );
}
