import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-black min-h-screen text-[#f5f5f7]`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-white/5 bg-black">
            <div className="max-w-[980px] mx-auto px-6 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-xs">
                <div>
                  <p className="font-semibold text-gray-300 mb-3">Platform</p>
                  <div className="space-y-2 text-gray-500">
                    <a href="/" className="block hover:text-white transition">Discover</a>
                    <a href="/submit" className="block hover:text-white transition">Submit</a>
                    <a href="/ai-studio" className="block hover:text-white transition">AI Studio</a>
                    <a href="/dashboard" className="block hover:text-white transition">Impact</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-300 mb-3">Community</p>
                  <div className="space-y-2 text-gray-500">
                    <a href="/communities" className="block hover:text-white transition">Communities</a>
                    <a href="/auth/login" className="block hover:text-white transition">Sign In</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-300 mb-3">Ecosystem</p>
                  <div className="space-y-2 text-gray-500">
                    <a href="https://sportsingularity.com" className="block hover:text-white transition" target="_blank" rel="noopener">Sport Singularity</a>
                    <a href="https://collectiveinnovation.no" className="block hover:text-white transition" target="_blank" rel="noopener">COLIN</a>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-300 mb-3">Philosophy</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">Think → Learn → Act → Amplify</p>
                  <p className="text-gray-600 text-[11px] mt-2">The Amplify Pillar of Sport Singularity</p>
                </div>
              </div>
              <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-[11px] text-gray-600">© 2026 Sport Singularity. All rights reserved.</p>
                <p className="text-[11px] text-gray-600">Built with purpose for European sport.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
