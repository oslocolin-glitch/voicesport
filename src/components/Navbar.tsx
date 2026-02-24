"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import { LogOut, User, ChevronDown, Menu, X, Shield, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Discover" },
  { href: "/submit", label: "Submit" },
  { href: "/ai-studio", label: "AI Studio" },
  { href: "/dashboard", label: "Impact" },
  { href: "/communities", label: "Community" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full transition-all hover:opacity-70"
      style={{ color: "var(--text-secondary)" }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: "var(--bg-card)" }} />;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/login" className="text-sm font-medium transition hover:opacity-70" style={{ color: "var(--text-secondary)" }}>Sign In</Link>
        <Link href="/auth/signup" className="text-sm font-medium px-4 py-2 rounded-full transition" style={{ background: "var(--pill-active-bg)", color: "var(--pill-active-text)" }}>Join Free</Link>
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
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-full transition" style={{ background: open ? "var(--bg-card)" : "transparent" }}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--text-tertiary)" }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl shadow-2xl p-1.5 overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-3 py-2.5 mb-1">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{name}</p>
              <p className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>{email}</p>
            </div>
            <div className="h-px mx-2 mb-1" style={{ background: "var(--border)" }} />
            <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition hover:opacity-80" style={{ color: "var(--text-secondary)" }} onClick={() => setOpen(false)}>
              <User className="w-4 h-4" /> Profile
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 text-sm text-violet-500 hover:bg-violet-500/10 rounded-xl transition" onClick={() => setOpen(false)}>
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <div className="h-px mx-2 my-1" style={{ background: "var(--border)" }} />
            <button onClick={() => { setOpen(false); signOut(); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition">
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

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-[980px] mx-auto px-6 flex items-center h-12 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-sm font-extrabold">V</div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline" style={{ color: "var(--text-primary)" }}>VoiceSport</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className="text-xs font-medium transition hover:opacity-70" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="hidden md:block"><UserMenu /></div>
          <button className="md:hidden p-1.5" onClick={() => setMobileOpen(v => !v)} style={{ color: "var(--text-secondary)" }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-xl px-6 py-4 space-y-1" style={{ borderTop: "1px solid var(--border)", background: "var(--nav-bg)" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm rounded-xl transition hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}><UserMenu /></div>
        </div>
      )}
    </header>
  );
}
