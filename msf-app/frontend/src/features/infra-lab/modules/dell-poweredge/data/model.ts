const SHAPES: Record<string, string> = {
  R: "Rack, dipasang di rak",
  T: "Tower, berdiri sendiri",
  M: "Modular (blade)",
  C: "Cloud / high-density",
  X: "Modular (sled MX)",
};

const GENERATIONS: Record<string, string> = {
  "3": "13th Gen",
  "4": "14th Gen",
  "5": "15th Gen",
  "6": "16th Gen",
  "7": "17th Gen",
};

export const MODEL_EXAMPLES = ["R760", "R660", "R750", "T550", "R7525"];

export interface ModelPart {
  key: string;
  meaning: string;
}

/** Pecah nama model PowerEdge jadi bagian-bagiannya. null = format belum dikenali. */
export function decodeModel(input: string): ModelPart[] | null {
  const m = input.toUpperCase().replace(/\s/g, "");
  const match = m.match(/^(MX|[RTMC])(\d{3,4})$/);
  if (!match) return null;

  const [, letter, digits] = match;
  const cls = digits[0];
  const parts: ModelPart[] = [
    {
      key: letter,
      meaning: SHAPES[letter === "MX" ? "X" : letter] ?? "Bentuk lain",
    },
    {
      key: cls,
      meaning:
        letter === "R"
          ? cls === "6"
            ? "Kelas 6xx, umumnya tipis (1U)"
            : cls === "7"
              ? "Kelas 7xx, umumnya 2U, muat lebih banyak disk"
              : `Kelas ${cls}xx`
          : `Kelas/ukuran ${cls}xx`,
    },
    {
      key: digits[1],
      meaning: GENERATIONS[digits[1]]
        ? `Generasi: ${GENERATIONS[digits[1]]}`
        : "Generasi tidak dikenal",
    },
  ];

  if (digits.length === 3) {
    const v = digits[2];
    parts.push({
      key: v,
      meaning:
        v === "0"
          ? "Prosesor Intel"
          : v === "5"
            ? "Prosesor AMD"
            : `Varian ${v}`,
    });
  } else {
    parts.push({
      key: digits.slice(2),
      meaning:
        digits[3] === "5"
          ? "Model 4 digit, umumnya prosesor AMD"
          : "Varian khusus",
    });
  }
  return parts;
}
