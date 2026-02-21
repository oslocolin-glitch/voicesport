import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceSport — European Sport Knowledge Hub",
  description: "Discover, transform and apply sport knowledge from EU projects. AI-powered summaries, translations and practitioner tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0F172A] min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-[#0B1120] border-t border-white/5 py-6 text-center">
            <p className="text-xs text-gray-500">VoiceSport — The Amplify Pillar of Sport Singularity · Think → Learn → Act → Amplify</p>
            <p className="text-[10px] text-gray-600 mt-1">© 2026 Sport Singularity</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
