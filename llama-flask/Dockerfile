# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc \
  libpq-dev \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install application dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . /app/

# Specify the command to run on container start
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "4000", "--reload"]