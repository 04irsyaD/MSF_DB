"use client";

import Editor from "@monaco-editor/react";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SqlEditorProps {
  value: string;
  onChange: (val: string | undefined) => void;
}

export const defaultSQL = `-- Contoh DDL SQL. Ketik atau paste DDL Anda di sini:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE
);`;

export default function SqlEditor({ value, onChange }: SqlEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("SQL disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange("");
    toast.info("Editor dibersihkan");
  };

  return (
    <div className="flex flex-col h-[500px] border border-border rounded-[4px] overflow-hidden bg-card focus-within:border-accent/50 hover:border-accent/30 transition-colors duration-150">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            DDL EDITOR
          </span>
          <span className="w-1.5 h-3 bg-accent animate-pulse inline-block" />
        </div>
        
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-[4px] bg-secondary/60 hover:bg-secondary border border-border hover:border-accent/40 text-muted-foreground hover:text-white transition-all duration-150 text-xs flex items-center gap-1.5 font-mono"
              title="Salin SQL"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>COPY</span>
            </button>
          )}

          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-[4px] bg-secondary/30 hover:bg-red-500/10 border border-border hover:border-red-500/20 text-muted-foreground hover:text-red-400 transition-all duration-150 text-xs font-mono uppercase"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 relative bg-[#0d1117]">
        <Editor
          height="100%"
          language="sql"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          loading={
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card gap-3">
              <div className="h-8 w-8 rounded-none border-2 border-accent/20 border-t-accent animate-spin" />
              <span className="text-xs font-mono text-muted-foreground">
                LOADING EDITOR...
              </span>
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            fontFamily: "JetBrains Mono, Fira Code, source-code-pro, Menlo, Monaco, Consolas, monospace",
            cursorBlinking: "blink",
            cursorStyle: "block",
            cursorSmoothCaretAnimation: "off",
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
