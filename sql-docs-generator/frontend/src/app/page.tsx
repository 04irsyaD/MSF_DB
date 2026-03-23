'use client'

import { useState } from 'react'
import { 
  Database, 
  FileText, 
  Settings, 
  Play, 
  Download, 
  Copy, 
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface CustomTerm {
  term: string
  definition: string
}

interface ApiResponse {
  success: boolean
  documentation: string
  tables_processed: number
  message: string
}

export default function Home() {
  // Form state
  const [sqlContent, setSqlContent] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [language, setLanguage] = useState('Indonesian')
  const [detailLevel, setDetailLevel] = useState('detailed')
  const [businessContext, setBusinessContext] = useState('')
  const [customTerms, setCustomTerms] = useState<CustomTerm[]>([])
  const [newTerm, setNewTerm] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [documentation, setDocumentation] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input')

  const sampleSQL = `-- Sample SQL untuk testing
CREATE TABLE t_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES t_users(id),
    FOREIGN KEY (role_id) REFERENCES t_roles(id)
);`

  const addCustomTerm = () => {
    if (newTerm && newDefinition) {
      setCustomTerms([...customTerms, { term: newTerm, definition: newDefinition }])
      setNewTerm('')
      setNewDefinition('')
    }
  }

  const removeCustomTerm = (index: number) => {
    setCustomTerms(customTerms.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    if (!sqlContent.trim()) {
      setError('SQL content tidak boleh kosong')
      return
    }

    setIsLoading(true)
    setError('')
    setDocumentation('')

    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql_content: sqlContent,
          project_name: projectName || 'Database Documentation',
          project_description: projectDescription || undefined,
          author: author || undefined,
          language,
          output_format: 'markdown',
          detail_level: detailLevel,
          business_context: businessContext || undefined,
          custom_terms: customTerms.length > 0 ? customTerms : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setDocumentation(data.documentation)
        setActiveTab('preview')
      } else {
        setError(data.message || 'Gagal generate dokumentasi')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghubungi server')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(documentation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'documentation'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">SQL Docs Generator</h1>
            <p className="text-sm text-gray-500">Generate database documentation using AI</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Form */}
          <div className="space-y-4">
            {/* SQL Input */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  SQL Schema (DDL)
                </label>
                <button
                  onClick={() => setSqlContent(sampleSQL)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                value={sqlContent}
                onChange={(e) => setSqlContent(e.target.value)}
                placeholder="Paste CREATE TABLE statements here..."
                className="w-full h-64 p-3 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4" />
                Project Information
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Project Description"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <label className="font-semibold text-gray-700 mb-3 block">Output Settings</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Indonesian">Indonesian</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Detail Level</label>
                  <select
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="simple">Simple</option>
                    <option value="detailed">Detailed</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Business Context */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <label className="font-semibold text-gray-700 mb-2 block">
                Business Context (Optional)
              </label>
              <textarea
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                placeholder="Describe the business context of this database..."
                className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Custom Terms */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <label className="font-semibold text-gray-700 mb-3 block">
                Custom Terms / Glossary (Optional)
              </label>
              
              {customTerms.length > 0 && (
                <div className="space-y-2 mb-3">
                  {customTerms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <span className="font-mono text-sm font-medium text-blue-600">{term.term}</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-sm text-gray-600 flex-1">{term.definition}</span>
                      <button
                        onClick={() => removeCustomTerm(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Term"
                  className="w-32 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Definition"
                  className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addCustomTerm}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !sqlContent.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Generate Documentation
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Panel - Output Preview */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('input')}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === 'input'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Input Summary
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === 'preview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentation Preview
              </button>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100vh-280px)] overflow-y-auto">
              {activeTab === 'input' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">📋 Input Summary</h3>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• SQL Content: {sqlContent ? `${sqlContent.length} characters` : 'Not provided'}</li>
                      <li>• Project: {projectName || 'Not specified'}</li>
                      <li>• Language: {language}</li>
                      <li>• Detail Level: {detailLevel}</li>
                      <li>• Custom Terms: {customTerms.length} defined</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">💡 Tips</h3>
                    <ul className="space-y-1 text-sm text-amber-700">
                      <li>• Pastikan Ollama sudah running di localhost:11434</li>
                      <li>• Gunakan model llama3 atau codellama untuk hasil terbaik</li>
                      <li>• Tambahkan business context untuk dokumentasi lebih akurat</li>
                      <li>• Definisikan custom terms untuk istilah domain khusus</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {documentation ? (
                    <>
                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          onClick={downloadMarkdown}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Download className="w-4 h-4" />
                          Download .md
                        </button>
                      </div>
                      
                      {/* Markdown Preview */}
                      <div className="markdown-body prose max-w-none">
                        <ReactMarkdown>{documentation}</ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FileText className="w-16 h-16 mb-4" />
                      <p>Documentation will appear here after generation</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
