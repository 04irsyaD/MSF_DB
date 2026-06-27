import { NextRequest, NextResponse } from "next/server";
import { TableMetadata } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, language, detail_level, business_context, ai_provider, model } = body as {
      table: TableMetadata;
      language: "Indonesian" | "English";
      detail_level: "simple" | "detailed" | "comprehensive";
      business_context?: string;
      ai_provider: "ollama" | "deepseek" | "openai";
      model: string;
    };

    if (!table || !ai_provider || !model) {
      return NextResponse.json(
        { detail: "Parameter table, ai_provider, dan model harus diisi." },
        { status: 400 }
      );
    }

    // 1. Build prompt
    const prompt = buildPrompt(table, language, detail_level, business_context);

    // 2. Call AI Provider
    let aiDescription = "";
    try {
      aiDescription = await callAIProvider(prompt, ai_provider, model);
    } catch (e: any) {
      // Fallback description if AI fails
      aiDescription = `*Gagal menghasilkan deskripsi otomatis menggunakan AI (${e.message || e}).*`;
    }

    // 3. Build Markdown structure for table columns
    const columnsTableMd = buildColumnsTable(table, language);
    const fkSectionMd = buildFkSection(table, language);
    const indexSectionMd = (table.indexes && detail_level === "comprehensive") 
      ? buildIndexSection(table, language) 
      : "";

    // 4. Combine into final markdown for this table
    let markdown = "";
    if (language === "Indonesian") {
      markdown = `## Tabel: \`${table.name}\`

${aiDescription}

### Kolom

${columnsTableMd}
${fkSectionMd}${indexSectionMd}`;
    } else {
      markdown = `## Table: \`${table.name}\`

${aiDescription}

### Columns

${columnsTableMd}
${fkSectionMd}${indexSectionMd}`;
    }

    return NextResponse.json({ markdown });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal generate tabel: ${error.message || error}` },
      { status: 500 }
    );
  }
}

/**
 * Call the selected AI provider using standard fetch
 */
async function callAIProvider(prompt: string, provider: string, model: string): Promise<string> {
  const timeoutMs = 60000; // 60s timeout

  if (provider === "ollama") {
    const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
    const res = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 2048,
          top_p: 0.9,
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Model '${model}' tidak ditemukan di Ollama.`);
      }
      throw new Error(`Ollama error: status ${res.status}`);
    }

    const data = await res.json();
    return (data.response || "").trim();
  }

  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY || "";
    if (!apiKey) {
      throw new Error("DeepSeek API Key belum di-set di environment.");
    }
    const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional database documentation expert. Generate clear, concise, and accurate documentation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("DeepSeek API Key tidak valid.");
      }
      throw new Error(`DeepSeek API error: status ${res.status}`);
    }

    const data = await res.json();
    return (data.choices?.[0]?.message?.content || "").trim();
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY || "";
    if (!apiKey) {
      throw new Error("OpenAI API Key belum di-set di environment.");
    }
    const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional database documentation expert. Generate clear, concise, and accurate documentation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("OpenAI API Key tidak valid.");
      }
      throw new Error(`OpenAI API error: status ${res.status}`);
    }

    const data = await res.json();
    return (data.choices?.[0]?.message?.content || "").trim();
  }

  throw new Error(`AI Provider '${provider}' tidak didukung.`);
}

/**
 * Build prompt for LLM based on TableMetadata
 */
function buildPrompt(
  table: TableMetadata,
  language: "Indonesian" | "English",
  detailLevel: "simple" | "detailed" | "comprehensive",
  businessContext?: string
): string {
  // Format column description hints
  const colsRepr = table.columns
    .map(col => {
      const flags: string[] = [];
      if (col.is_primary_key) flags.push("PRIMARY KEY");
      if (col.is_foreign_key) flags.push("FOREIGN KEY");
      if (!col.is_nullable) flags.push("NOT NULL");
      if (col.default_value) flags.push(`DEFAULT ${col.default_value}`);

      let desc = `  - ${col.name} (${col.data_type})`;
      if (flags.length > 0) {
        desc += ` [${flags.join(", ")}]`;
      }
      return desc;
    })
    .join("\n");

  // Format foreign key relationships hints
  let fkText = "";
  if (table.foreign_keys && table.foreign_keys.length > 0) {
    const fkLines = table.foreign_keys
      .map(fk => `  - ${fk.column} → ${fk.references_table}.${fk.references_column}`)
      .join("\n");
    fkText = `\nForeign Keys:\n${fkLines}`;
  }

  // Row count hint
  const rowHint = table.row_count !== undefined && table.row_count !== null
    ? `\nJumlah data saat ini: ${table.row_count.toLocaleString()} baris`
    : "";

  // Additional context
  let contextText = "";
  if (businessContext) {
    contextText = language === "Indonesian"
      ? `\nKonteks Bisnis: ${businessContext}`
      : `\nBusiness Context: ${businessContext}`;
  }

  if (language === "Indonesian") {
    const detailInstruction = {
      simple: "Berikan deskripsi singkat (2-3 kalimat) tentang tujuan tabel ini.",
      detailed: "Berikan deskripsi mendetail tentang tujuan tabel, deskripsi singkat tiap kolom penting, dan hubungannya dengan tabel lain.",
      comprehensive: "Berikan dokumentasi komprehensif: tujuan tabel, penjelasan setiap kolom, relasi, use case bisnis, dan catatan teknis penting.",
    }[detailLevel] || "Berikan deskripsi mendetail.";

    return `Kamu adalah ahli dokumentasi database. Buat dokumentasi dalam Bahasa Indonesia untuk tabel database berikut:

Nama Tabel: ${table.name}
Schema: ${table.schema}
${rowHint}

Kolom:
${colsRepr}
${fkText}${contextText}

Instruksi: ${detailInstruction}
Tulis dalam format prosa yang jelas. Jangan ulangi informasi yang sudah ada di tabel kolom.
Fokus pada: APA tujuan tabel ini, MENGAPA kolom-kolom ini ada, dan BAGAIMANA tabel ini digunakan.
Jawaban hanya berisi deskripsi, tanpa heading atau markdown tambahan.`;
  } else {
    const detailInstruction = {
      simple: "Provide a brief description (2-3 sentences) about this table's purpose.",
      detailed: "Provide a detailed description about the table purpose, brief explanation of important columns, and its relationship with other tables.",
      comprehensive: "Provide comprehensive documentation: table purpose, column explanations, relationships, business use cases, and important technical notes.",
    }[detailLevel] || "Provide a detailed description.";

    return `You are a database documentation expert. Create documentation in English for the following database table:

Table Name: ${table.name}
Schema: ${table.schema}
${rowHint}

Columns:
${colsRepr}
${fkText}${contextText}

Instruction: ${detailInstruction}
Write in clear prose format. Do not repeat information already shown in the column table.
Focus on: WHAT is the purpose of this table, WHY these columns exist, and HOW this table is used.
Response should contain only the description, without additional headings or markdown.`;
  }
}

/**
 * Build Markdown table of columns
 */
function buildColumnsTable(table: TableMetadata, language: "Indonesian" | "English"): string {
  const isIndo = language === "Indonesian";
  const header = isIndo
    ? "| Kolom | Tipe Data | Nullable | Keterangan |"
    : "| Column | Data Type | Nullable | Notes |";
  const separator = isIndo
    ? "|-------|-----------|----------|------------|"
    : "|--------|-----------|----------|-------|";

  const rows = table.columns.map(col => {
    const flags: string[] = [];
    if (col.is_primary_key) flags.push("🔑 PK");
    if (col.is_foreign_key) flags.push("🔗 FK");
    if (col.default_value) flags.push(`default: \`${col.default_value}\``);

    const nullable = col.is_nullable 
      ? (isIndo ? "Ya" : "Yes") 
      : (isIndo ? "Tidak" : "No");
    const notes = flags.length > 0 ? flags.join(" · ") : "-";

    return `| \`${col.name}\` | \`${col.data_type}\` | ${nullable} | ${notes} |`;
  });

  return [header, separator, ...rows].join("\n");
}

/**
 * Build ForeignKey section
 */
function buildFkSection(table: TableMetadata, language: "Indonesian" | "English"): string {
  if (!table.foreign_keys || table.foreign_keys.length === 0) return "";

  const isIndo = language === "Indonesian";
  const title = isIndo 
    ? "\n\n### Relasi (Foreign Key)\n" 
    : "\n\n### Relationships (Foreign Keys)\n";

  const lines = table.foreign_keys.map(fk => {
    let line = `- \`${fk.column}\` → \`${fk.references_table}.${fk.references_column}\``;
    if (fk.on_delete) {
      line += ` _(ON DELETE ${fk.on_delete})_`;
    }
    return line;
  });

  return title + lines.join("\n") + "\n";
}

/**
 * Build Index section
 */
function buildIndexSection(table: TableMetadata, language: "Indonesian" | "English"): string {
  if (!table.indexes || table.indexes.length === 0) return "";

  const isIndo = language === "Indonesian";
  const title = isIndo ? "\n\n### Index\n" : "\n\n### Indexes\n";

  const lines = table.indexes.map(idx => {
    const uniqueLabel = idx.is_unique 
      ? (isIndo ? " (Unik)" : " (Unique)") 
      : "";
    return `- \`${idx.name}\`: \`(${idx.columns.join(", ")})\`${uniqueLabel}`;
  });

  return title + lines.join("\n") + "\n";
}
