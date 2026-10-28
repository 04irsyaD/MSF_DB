import Link from "next/link";
import { Database, Sparkles, FileText, ArrowRight, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">MSF DB</span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Buka Workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-emerald-50/20 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Database Documentation
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Dokumentasikan Database
            <span className="text-emerald-500 block md:inline"> dalam Hitungan Menit</span>
          </h1>

          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Hasilkan dokumentasi database yang komprehensif, indah, dan terstruktur secara instan dari SQL skema atau koneksi database langsung menggunakan AI lokal yang aman.
          </p>

          {/* Privacy Security Trust Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-medium">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Skema database diproses <strong>100% lokal &amp; aman</strong> di perangkat Anda.</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5"
            >
              Mulai Sekarang (Gratis)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all hover:-translate-y-0.5"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (Sangat Ringkas) */}
      <section id="features" className="py-16 px-6 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Mengapa Memilih MSF DB?</h2>
            <p className="text-xs text-muted-foreground">Tiga pilar utama untuk menyederhanakan pengelolaan struktur database Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Database className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900">Multi-Database Support</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Dukungan penuh untuk dialek database populer seperti PostgreSQL, MySQL, SQLite, dan SQL Server.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900">Lokal &amp; Offline AI</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Integrasikan dengan Ollama lokal untuk keamanan data penuh secara offline, atau gunakan API Cloud pilihan Anda.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900">Indah &amp; Siap Ekspor</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ubah skema menjadi live diagram interaktif dan ekspor dokumentasi dalam format Markdown (.md) atau Microsoft Word (.docx).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 border-t border-gray-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="font-bold text-sm">MSF DB</span>
          </div>
          <p className="text-center sm:text-right font-mono text-[10px]">
            &copy; {new Date().getFullYear()} MSF Team. 100% Local &amp; Secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
