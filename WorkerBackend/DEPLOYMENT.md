# WorkerBackend - Production Deployment Guide

## Overview
This guide provides instructions for deploying the WorkerBackend application using Docker and Docker Compose.

## Architecture
- **Backend**: Java 21, Spring Boot 3.x (Port 8090)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Search**: OpenSearch 2.12
- **Proxy**: Nginx (Reverse Proxy)

## Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 8GB RAM recommended

## Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 2. Deploy
```bash
docker-compose up -d --build
```

### 3. Verify
- Health Check: `http://localhost/actuator/health` (via Nginx)
- Swagger Docs: `http://localhost/swagger-ui.html`

## Service Details
- **Nginx**: Exposes Port 80 and 443. Proxies requests to the `backend` service.
- **OpenSearch**: Internal search engine for jobs and workers.
- **Postgres Backup**: Runs daily dumps to `./docker/backups`.

## Maintenance
- **Logs**: `docker-compose logs -f backend`
- **Restart**: `docker-compose restart backend`
- **Backup**: Handled automatically by the `postgres-backup` service.

---
**Version**: 1.0  
**Last Updated**: 2026-04-10
