FROM python:3.11-slim

# Create app directory
WORKDIR /app

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# Copy requirements early to leverage Docker cache
COPY summary/requirements.txt /app/requirements.txt

# Install dependencies if requirements.txt exists
RUN if [ -f /app/requirements.txt ]; then \
      pip install --no-cache-dir -r /app/requirements.txt; \
    fi

# Copy the summary folder (source code)
COPY summary /app/summary

# Default entrypoint runs python so user can override command to run any script
ENTRYPOINT ["python"]

# By default run the main script; can be overridden by 'docker run <image> python <script>'
CMD ["summary/scripts/main.py"]
