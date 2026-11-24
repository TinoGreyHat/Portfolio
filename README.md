# Portfolio TinoGreyHat

A modern, cybersecurity-themed portfolio website built with **React 19 + Vite 8** (frontend) and **Spring Boot 4.1.1 + Java 17** (backend).

## 🚀 Features

- **Frontend**: React 19, React Router 7, Vite 8, Lucide React icons
- **Backend**: Spring Boot 4.1.1, Spring Security, JWT Authentication (JJWT 0.11.5)
- **Database**: H2 (development), PostgreSQL (production)
- **Internationalization**: French/English with localStorage persistence
- **Theming**: 6 color themes + Dark/Light/System modes with CSS variables
- **Admin Dashboard**: Full CRUD for Projects, Certifications, Roadmap
- **Roadmap**: Interactive 21-level career path visualization with SVG
- **Tech Watch**: Live CISA KEV feed integration
- **Responsive**: Mobile-first design with hamburger menu
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## 📋 Prerequisites

- **Node.js** 20+ and npm
- **Java** 17+
- **Maven** 3.9+ (or use included wrapper)
- **PostgreSQL** 15+ (for production)

## 🛠️ Quick Start (Development)

### 1. Clone and Install Dependencies

```bash
# Frontend
cd Portfolio
npm install

# Backend
cd ../backend
./mvnw install -DskipTests
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your values (see Configuration section below)
```

### 3. Start Development Servers

```bash
# Terminal 1 - Frontend (port 5173)
cd Portfolio
npm run dev

# Terminal 2 - Backend (port 8080)
cd backend
./mvnw spring-boot:run
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Admin Login**: http://localhost:5173/admin
  - Default credentials: `admin` / `admin123` (change in .env!)

## ⚙️ Configuration

### Environment Variables (.env)

| Variable | Description | Default (Dev) |
|----------|-------------|---------------|
| `DB_URL` | Database JDBC URL | H2 in-memory |
| `DB_USERNAME` | Database username | `sa` |
| `DB_PASSWORD` | Database password | (empty) |
| `DB_DRIVER` | JDBC driver class | `org.h2.Driver` |
| `DB_DIALECT` | Hibernate dialect | `org.hibernate.dialect.H2Dialect` |
| `JWT_SECRET` | Base64-encoded secret (64+ chars) | Dev placeholder |
| `JWT_EXPIRATION` | Token TTL in ms | `86400000` (24h) |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_EMAIL` | Admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin password (BCrypt encoded at runtime) | `admin123` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `MAIL_USERNAME` | SMTP username | (empty) |
| `MAIL_PASSWORD` | SMTP password | (empty) |
| `MAIL_TO` | Contact form recipient | `teteblaise9@gmail.com` |

### Production Profile

```bash
# Backend with production profile
./mvnw spring-boot:run -Dspring.profiles.active=prod

# Or with environment variable
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

**Production requirements:**
- PostgreSQL database running
- `spring.jpa.hibernate.ddl-auto=validate` (no auto-schema changes)
- Strong `JWT_SECRET` (generate with `openssl rand -base64 64`)
- Secure `ADMIN_PASSWORD`
- Production `CORS_ALLOWED_ORIGINS` (your domain)
- SMTP credentials for contact form

## 🏗️ Building for Production

### Frontend (Static Files)

```bash
cd Portfolio
npm run build
```

Output: `docs/` directory (configured for GitHub Pages)

### Backend (JAR)

```bash
cd backend
./mvnw clean package -DskipTests
```

Output: `target/Porfolio-0.0.1-SNAPSHOT.jar`

Run: `java -jar target/Porfolio-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

## 🐳 Docker Deployment (Optional)

### Dockerfile (Frontend + Backend)

```dockerfile
# Multi-stage build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Portfolio/package*.json ./
RUN npm ci
COPY Portfolio/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar
COPY --from=frontend-builder /app/frontend/docs ./static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_URL: jdbc:postgresql://postgres:5432/portfolio
      DB_USERNAME: portfolio
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## 📁 Project Structure

```
Portfolio/
├── Portfolio/                 # Frontend (React + Vite)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── roadmap/      # Roadmap visualization
│   │   ├── contexts/         # React contexts (I18n, Theme)
│   │   ├── locales/          # Translation files (fr.js, en.js)
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities (theme)
│   │   ├── App.jsx           # Main app & routes
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env                  # Environment config (not in git)
│
├── backend/                   # Backend (Spring Boot)
│   ├── src/main/java/com/blaise/
│   │   ├── config/           # Data initializer, security config
│   │   ├── controller/       # REST controllers (10)
│   │   ├── entity/           # JPA entities (9)
│   │   ├── repository/       # Spring Data repositories (9)
│   │   ├── security/         # JWT auth, filters, config
│   │   ├── service/          # Business logic
│   │   └── PorfolioApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── .env.example              # Environment template
├── README.md
└── AUDIT_REPORT.md           # Technical audit report
```

## 🔐 Security Features

- **Stateless JWT Authentication** with HS512 signing
- **BCrypt** password hashing (cost factor 10)
- **Role-based access** (ADMIN only for admin endpoints)
- **CORS** configurable via environment
- **CSRF disabled** for stateless API
- **Security headers** via Spring Security defaults
- **Input validation** with Bean Validation (JSR-380)

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/projects` | Public | List projects |
| GET | `/api/projects/{id}` | Public | Get project |
| POST | `/api/projects` | Admin | Create project |
| PUT | `/api/projects/{id}` | Admin | Update project |
| DELETE | `/api/projects/{id}` | Admin | Delete project |
| GET | `/api/certifications` | Public | List certifications |
| GET | `/api/skills` | Public | List skills |
| GET | `/api/roadmap` | Public | List roadmap levels |
| GET | `/api/roadmap/{level}` | Public | Get level details |
| PUT | `/api/roadmap/{level}` | Admin | Update level status |
| GET | `/api/veille/cisa` | Public | CISA KEV feed |
| POST | `/api/contact` | Public | Send contact form |

## 🧪 Testing

```bash
# Frontend linting
cd Portfolio
npx oxlint .

# Backend tests
cd ../backend
./mvnw test
```

## 📦 Deployment Checklist

- [ ] Copy `.env.example` to `.env` and fill in **all** production values
- [ ] Generate strong `JWT_SECRET` (`openssl rand -base64 64`)
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Configure PostgreSQL database
- [ ] Set `CORS_ALLOWED_ORIGINS` to your production domain(s)
- [ ] Configure SMTP for contact form
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Run `npm run build` for frontend
- [ ] Run `./mvnw clean package` for backend
- [ ] Deploy JAR behind reverse proxy (nginx) with HTTPS
- [ ] Configure SSL/TLS certificates
- [ ] Set up database backups
- [ ] Configure monitoring/logging

## 🛡️ Security Notes

> **⚠️ IMPORTANT**: The default `.env` contains development credentials. **Never** use these in production!

- Change all default passwords before deployment
- Use a strong, unique `JWT_SECRET` (min 64 chars base64)
- Restrict `CORS_ALLOWED_ORIGINS` to your exact domains
- Enable HTTPS in production (reverse proxy)
- Keep dependencies updated (`npm audit`, `mvnw versions:display-dependency-updates`)

## 📄 License

This project is a personal portfolio. All rights reserved.

## 👤 Author

**TETE Kokou Blaise Etiam** (TinoGreyHat)
- GitHub: [@TinoGreyHat](https://github.com/TinoGreyHat)
- LinkedIn: [TinoGreyHat](https://linkedin.com/in/tinogreyhat)
- TryHackMe: [TinoGreyHat](https://tryhackme.com/p/TinoGreyHat)

---

*Built with passion for cybersecurity • Last updated: 2026-11-20*