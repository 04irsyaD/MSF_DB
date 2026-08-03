# ==============================================================
# MSF-APP Backend — Dockerfile
# ==============================================================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
# - curl: untuk healthcheck
# - gcc + libpq-dev: untuk psycopg2
# - unixodbc-dev + msodbcsql18: untuk pyodbc (SQL Server)
# Repositori Microsoft diverifikasi lewat kunci GPG, bukan apt-key yang usang.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    gnupg \
    ca-certificates \
    libpq-dev \
    unixodbc-dev \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
       | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
       > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Buat direktori untuk output files
RUN mkdir -p /app/outputs /app/templates /app/shortcuts_data

# Create non-root user and group for security hardening
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Port yang diekspos
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Jalankan FastAPI dengan uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
