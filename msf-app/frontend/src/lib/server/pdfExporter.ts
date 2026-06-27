import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export class PdfExporter {
  /**
   * Convert markdown text into a PDF Document buffer using pdf-lib.
   */
  public static async export(markdown: string, projectName: string, author?: string): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    let y = height - 50; // top margin
    const x = 50;        // left margin
    const bottomMargin = 50;
    const contentWidth = width - 100;

    const checkPageBreak = (neededHeight: number) => {
      if (y - neededHeight < bottomMargin) {
        page = pdfDoc.addPage();
        y = height - 50;
      }
    };

    // Draw Main Title
    checkPageBreak(30);
    page.drawText(`Dokumentasi Database: ${projectName}`, {
      x,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.22, 0.45),
    });
    y -= 25;

    if (author) {
      checkPageBreak(20);
      page.drawText(`Author: ${author}`, {
        x,
        y,
        size: 10,
        font: fontItalic,
        color: rgb(0.3, 0.3, 0.3),
      });
      y -= 18;
    }

    // Draw Divider Line
    checkPageBreak(15);
    page.drawLine({
      start: { x, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 20;

    const lines = markdown.split(/\r?\n/);
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    const printWrappedLine = (text: string, size: number, font: any, color: any, spacing: number) => {
      // Estimate max characters per line based on standard Helvetica metrics
      const maxChars = Math.floor(contentWidth / (size * 0.52));
      const wrapped = wrapText(text, maxChars);

      for (const lineText of wrapped) {
        checkPageBreak(size + 5);
        page.drawText(lineText, {
          x,
          y,
          size,
          font,
          color,
        });
        y -= (size + spacing);
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Handle Markdown Tables
      if (line.startsWith("|")) {
        // Skip separator row (e.g. |---|---|)
        if (line.includes("---")) {
          continue;
        }

        inTable = true;
        const cells = line
          .split("|")
          .map(c => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        if (tableHeaders.length === 0) {
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else {
        if (inTable) {
          // Table has ended, draw it
          if (tableHeaders.length > 0) {
            const colWidth = contentWidth / tableHeaders.length;
            const cellHeight = 22;

            // Draw Header Background Fill
            checkPageBreak(cellHeight + 5);
            page.drawRectangle({
              x,
              y: y - cellHeight,
              width: contentWidth,
              height: cellHeight,
              color: rgb(0.95, 0.96, 0.98),
            });

            // Draw Header Titles
            for (let c = 0; c < tableHeaders.length; c++) {
              page.drawText(tableHeaders[c], {
                x: x + c * colWidth + 5,
                y: y - 14,
                size: 8,
                font: fontBold,
                color: rgb(0.1, 0.1, 0.1),
              });
            }
            y -= cellHeight;

            // Draw Row Records
            for (const row of tableRows) {
              checkPageBreak(cellHeight);

              // Draw horizontal border line
              page.drawLine({
                start: { x, y },
                end: { x: x + contentWidth, y },
                thickness: 0.5,
                color: rgb(0.88, 0.9, 0.92),
              });

              for (let c = 0; c < row.length; c++) {
                const cellText = (row[c] || "").replace(/`/g, "");
                // Truncate cell text if it overflows columns
                const maxLen = Math.floor(colWidth / 5.2);
                const truncatedText =
                  cellText.length > maxLen
                    ? cellText.substring(0, maxLen - 3) + "..."
                    : cellText;

                page.drawText(truncatedText, {
                  x: x + c * colWidth + 5,
                  y: y - 14,
                  size: 8,
                  font: fontRegular,
                  color: rgb(0.2, 0.2, 0.2),
                });
              }
              y -= cellHeight;
            }

            // Draw bottom border line
            page.drawLine({
              start: { x, y },
              end: { x: x + contentWidth, y },
              thickness: 0.5,
              color: rgb(0.7, 0.7, 0.7),
            });

            y -= 10; // Spacer
            tableHeaders = [];
            tableRows = [];
          }
          inTable = false;
        }
      }

      if (!line) {
        continue;
      }

      // Parse markdown headings
      if (line.startsWith("# ")) {
        printWrappedLine(line.substring(2), 14, fontBold, rgb(0.15, 0.35, 0.65), 6);
      } else if (line.startsWith("## ")) {
        printWrappedLine(line.substring(3), 11.5, fontBold, rgb(0.2, 0.2, 0.25), 5);
      } else if (line.startsWith("### ")) {
        printWrappedLine(line.substring(4), 9.5, fontBold, rgb(0.3, 0.3, 0.35), 4);
      }
      // Parse lists
      else if (line.startsWith("- ")) {
        const cleanText = "•  " + line.substring(2).replace(/`/g, "");
        printWrappedLine(cleanText, 9, fontRegular, rgb(0.2, 0.2, 0.2), 3);
      }
      // Parse paragraphs
      else {
        const cleanText = line.replace(/`/g, "");
        printWrappedLine(cleanText, 9, fontRegular, rgb(0.2, 0.2, 0.2), 4);
      }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

/**
 * Basic word-wrapping helper
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  if (text.length <= maxCharsPerLine) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine = currentLine ? currentLine + " " + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
