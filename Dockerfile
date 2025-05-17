FROM python:3.9

WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV DEBUG=False
# Set a dummy secret key for the build process only
ENV SECRET_KEY='dummy_key_for_build_only'

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Create static directory
RUN mkdir -p /code/staticfiles

# Skip collectstatic during build - will run during startup
# RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE 8000

# Create startup script
RUN echo '#!/bin/bash\npython manage.py collectstatic --noinput\npython manage.py migrate\ngunicorn irops_project.wsgi:application --bind 0.0.0.0:$PORT' > /code/start.sh \
    && chmod +x /code/start.sh

# Run startup script
CMD ["/code/start.sh"]
