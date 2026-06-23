import Link from "next/link";
import { Database, Sparkles, FileText, Zap, ArrowRight, CheckCircle2, Shield, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">MSF DB</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">Cara Kerja</a>
            <a href="#tech" className="hover:text-gray-900 transition-colors">Teknologi</a>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Buka App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-20 px-6 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            AI-Powered Database Documentation
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Dokumentasikan Database
            <span className="text-emerald-500"> dalam Hitungan Menit</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            MSF DB menggunakan AI lokal untuk menghasilkan dokumentasi database yang komprehensif dan indah 
            dari SQL schema atau koneksi langsung ke database kamu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-base hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-0.5"
            >
              Mulai Sekarang
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 transition-all hover:-translate-y-0.5"
            >
              Pelajari Dulu
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
            <p className="text-gray-500">Semua alat yang kamu butuhkan untuk menghasilkan, mengelola, dan mengoptimalkan dokumentasi database.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Database Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Mendukung PostgreSQL, MySQL, SQLite, dan SQL Server (MSSQL). Cukup paste DDL atau hubungkan langsung.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Local & Cloud AI</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Hubungkan dengan Ollama lokal untuk keamanan data penuh, atau gunakan cloud providers seperti DeepSeek dan OpenAI.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Export Formats</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Ekspor dokumentasi database kamu ke format Markdown (.md), Microsoft Word (.docx), atau PDF secara instan.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">SQL Shortcuts</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Koleksi skrip DBA siap pakai untuk optimasi query, pemeriksaan performa, dan manajemen indeks database.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Security-focused</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Privasi data terjamin. Proteksi API Key terintegrasi dan opsi running model AI offline 100% lokal.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Job Queue</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Proses generate berjalan di background dengan queue system, memungkinkan kamu memantau progress per tabel secara real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cara Kerja</h2>
            <p className="text-gray-500">Tiga langkah mudah untuk menghasilkan dokumentasi database yang profesional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md shadow-emerald-100">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Masukkan Skema DDL</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Paste query DDL `CREATE TABLE` kamu ke editor SQL Monaco, atau masukkan detail koneksi database.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md shadow-emerald-100">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pilih Provider AI</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Pilih model AI lokal (Ollama) atau Cloud (DeepSeek/OpenAI), tentukan bahasa (ID/EN) dan format output.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md shadow-emerald-100">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dapatkan Dokumentasi</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Pantau status generate per tabel di dashboard, review markdown live preview, dan unduh file hasil akhirnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH TAGS */}
      <section id="tech" className="py-16 px-6 bg-gray-50 border-t border-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-6">Supported Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["PostgreSQL", "MySQL", "SQLite", "SQL Server", "Ollama", "DeepSeek API", "OpenAI API", "Next.js", "FastAPI", "Docker"].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-600">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-emerald-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Siap Menghemat Waktu Dokumentasi?</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">
            Gunakan kekuatan AI lokal untuk membuat dokumentasi database kamu terstruktur, rapi, dan mudah dipahami.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-600 font-bold text-base hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Mulai Sekarang (Gratis)
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="font-bold text-sm">MSF DB</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MSF Team. All rights reserved. Powered by Antigravity AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
