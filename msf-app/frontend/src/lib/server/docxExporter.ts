import { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, Packer } from "docx";

export class DocxExporter {
  /**
   * Convert markdown text into a Word Document buffer.
   */
  public static async export(markdown: string, projectName: string, author?: string): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch in twips
                bottom: 1440, // 1 inch
                left: 1440,   // 1 inch
                right: 1440,  // 1 inch
              },
            },
          },
          children: this._parseMarkdown(markdown, projectName, author),
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Markdown parser compiling text blocks into DOCX elements.
   */
  private static _parseMarkdown(markdown: string, projectName: string, author?: string): any[] {
    const children: any[] = [];

    // Title Page Header
    children.push(
      new Paragraph({
        text: `Dokumentasi Database: ${projectName}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    if (author) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Author: ", bold: true }),
            new TextRun({ text: author, italics: true }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    const lines = markdown.split(/\r?\n/);
    let inTable = false;
    let tableRows: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Handle Markdown Tables (e.g. | col1 | col2 |)
      if (line.startsWith("|")) {
        // Skip table separator line (e.g. |---|---|)
        if (line.includes("---")) {
          continue;
        }

        inTable = true;
        const cells = line
          .split("|")
          .map(c => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        const tableCells = cells.map(cellText => {
          // Remove backticks (code style) for clean word document format
          const cleanText = cellText.replace(/`/g, "");
          return new TableCell({
            children: [new Paragraph({ text: cleanText })],
            width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
          });
        });

        tableRows.push(new TableRow({ children: tableCells }));
        continue;
      } else {
        if (inTable) {
          // Table has ended, push it to document body
          if (tableRows.length > 0) {
            children.push(
              new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              })
            );
            children.push(new Paragraph({ text: "" })); // Spacer paragraph
            tableRows = [];
          }
          inTable = false;
        }
      }

      if (!line) {
        continue;
      }

      // Parse Markdown Headings
      if (line.startsWith("# ")) {
        children.push(
          new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith("## ")) {
        children.push(
          new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.startsWith("### ")) {
        children.push(
          new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
      }
      // Parse Markdown Bullet Lists
      else if (line.startsWith("- ")) {
        const cleanText = line.substring(2).replace(/`/g, "");
        children.push(
          new Paragraph({
            text: cleanText,
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        );
      }
      // Parse standard Paragraphs
      else {
        const cleanText = line.replace(/`/g, "");
        children.push(
          new Paragraph({
            text: cleanText,
            spacing: { after: 120 },
          })
        );
      }
    }

    // Push trailing table if any
    if (inTable && tableRows.length > 0) {
      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    }

    return children;
  }
}
