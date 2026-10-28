import html
import markdown
from xhtml2pdf import pisa
import io

class PdfExporter:
    """Export markdown to PDF format"""

    def export(self, markdown_content: str, project_name: str, author: str = None) -> bytes:
        escaped_project_name = html.escape(project_name)
        escaped_author = html.escape(author) if author else None

        # Convert Markdown to HTML
        html_content = markdown.markdown(markdown_content, extensions=['tables', 'fenced_code'])
        
        # Wrap with basic CSS styling
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{escaped_project_name}</title>
            <style>
                @page {{
                    size: a4 portrait;
                    margin: 2cm;
                }}
                body {{
                    font-family: Helvetica, Arial, sans-serif;
                    font-size: 12pt;
                    color: #333333;
                    line-height: 1.5;
                }}
                h1 {{ color: #2c3e50; font-size: 24pt; border-bottom: 2px solid #eee; padding-bottom: 5px; }}
                h2 {{ color: #34495e; font-size: 18pt; margin-top: 20px; }}
                h3 {{ color: #7f8c8d; font-size: 14pt; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }}
                th, td {{ border: 1px solid #bdc3c7; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; font-weight: bold; color: #2c3e50; }}
                code {{ background-color: #f8f9fa; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 10pt; }}
                pre {{ background-color: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #e9ecef; overflow-x: auto; }}
                pre code {{ background-color: transparent; padding: 0; }}
                .author {{ color: #7f8c8d; font-style: italic; margin-bottom: 20px; }}
            </style>
        </head>
        <body>
            <h1>Dokumentasi Database: {escaped_project_name}</h1>
            {f'<p class="author">Author: {escaped_author}</p>' if escaped_author else ''}
            {html_content}
        </body>
        </html>
        """

        # Generate PDF
        pdf_file = io.BytesIO()
        pisa_status = pisa.CreatePDF(io.StringIO(full_html), dest=pdf_file)
        
        if pisa_status.err:
            raise Exception("Gagal melakukan render PDF")
            
        return pdf_file.getvalue()
