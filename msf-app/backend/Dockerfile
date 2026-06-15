# ==============================================================
# MSF-APP Backend — Dockerfile
# ==============================================================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
# - curl: untuk healthcheck
# - gcc + libpq-dev: untuk psycopg2
# - default-libmysqlclient-dev: untuk pymysql
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Buat direktori untuk output files
RUN mkdir -p /app/outputs /app/templates /app/shortcuts_data

# Port yang diekspos
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Jalankan FastAPI dengan uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
