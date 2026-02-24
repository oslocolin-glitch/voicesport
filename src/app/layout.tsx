import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VoiceSport — European Sport Knowledge Hub",
  description: "Discover, transform and apply sport knowledge from EU projects. AI-powered summaries, translations and practitioner tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`} style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
            <div className="max-w-[980px] mx-auto px-6 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-xs">
                <div>
                  <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Platform</p>
                  <div className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                    <a href="/" className="block hover:opacity-70 transition">Discover</a>
                    <a href="/submit" className="block hover:opacity-70 transition">Submit</a>
                    <a href="/ai-studio" className="block hover:opacity-70 transition">AI Studio</a>
                    <a href="/dashboard" className="block hover:opacity-70 transition">Impact</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Community</p>
                  <div className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                    <a href="/communities" className="block hover:opacity-70 transition">Communities</a>
                    <a href="/auth/login" className="block hover:opacity-70 transition">Sign In</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Ecosystem</p>
                  <div className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                    <a href="https://sportsingularity.com" className="block hover:opacity-70 transition" target="_blank" rel="noopener">Sport Singularity</a>
                    <a href="https://collectiveinnovation.no" className="block hover:opacity-70 transition" target="_blank" rel="noopener">COLIN</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Philosophy</p>
                  <p className="leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Think → Learn → Act → Amplify</p>
                  <p className="mt-2" style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>The Amplify Pillar of Sport Singularity</p>
                </div>
              </div>
              <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-center gap-2" style={{ borderColor: "var(--border)" }}>
                <p style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>© 2026 Sport Singularity. All rights reserved.</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>Built with purpose for European sport.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
