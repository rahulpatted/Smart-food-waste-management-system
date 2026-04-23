# 🚀 Quick Start Guide - Pipeline Setup

Complete guide to set up the development environment with all pipeline improvements.

---

## ✅ What's Installed

### 1. **Jest Testing Framework** (Backend)
- **Location**: [backend/jest.config.js](backend/jest.config.js)
- **Purpose**: Run unit tests on backend
- **Coverage**: 50% minimum threshold

### 2. **Pytest Framework** (AI Service)
- **Location**: [ai-service/pytest.ini](ai-service/pytest.ini)
- **Files**: 
  - [ai-service/tests/test_model.py](ai-service/tests/test_model.py)
  - [ai-service/tests/test_api.py](ai-service/tests/test_api.py)
- **Purpose**: Test AI model predictions and FastAPI endpoints

### 3. **Husky Pre-Commit Hooks**
- **Files**:
  - [.husky/pre-commit](.husky/pre-commit)
  - [.lintstagedrc.json](.lintstagedrc.json)
- **Purpose**: Auto-run linting & formatting before each commit
- **Prevents**: Bad code from being committed

### 4. **Environment Configuration**
- **Location**: [.env.example](.env.example)
- **Purpose**: Template for environment variables
- **Usage**: `cp .env.example .env` then edit with your values

### 5. **Documentation**
- **CONTRIBUTING.md**: Development guidelines and workflow
- **PIPELINE_STATUS.md**: This file
- **health-check.ps1/sh**: Health check scripts for all services

---

## 🔧 Initial Setup (One-time)

### Step 1: Clone & Install Dependencies

```bash
# Backend
cd backend
npm install
npm run prepare  # Sets up Husky hooks

# Frontend
cd ../frontend
npm install
npm run prepare  # Sets up Husky hooks

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
# Create .env from template
cp .env.example .env

# Edit .env with your values
# Required:
#   - MONGO_URI (MongoDB connection string)
#   - JWT_SECRET (pick something secure)
# Optional: EMAIL_SERVICE_* if you want notifications
```

### Step 3: Verify Everything Works

```bash
# Backend tests
cd backend && npm test

# Frontend build
cd ../frontend && npm run build

# AI Service tests
cd ../ai-service && pytest tests/ -v
```

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Watch mode (re-run on changes)
npm test -- --watch

# With coverage report
npm test -- --coverage
```

### Frontend Linting & Build
```bash
cd frontend

# Lint check
npm run lint

# Verify build
npm run build
```

### AI Service Tests
```bash
cd ai-service

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_model.py -v

# With coverage
pytest tests/ --cov=. --cov-report=html
```

---

## ✨ Git Workflow with Husky

### Before Committing (Automatic)
```
Your code
   ↓
Pre-commit hook triggers
   ↓
Lint-staged runs:
  - ESLint (fixes formatting)
  - Prettier (auto-formats)
   ↓
If all pass: Commit succeeds ✅
If any fail: Commit blocked ❌
```

### Example

```bash
# Make changes
echo "console.log('hello')" >> backend/server.js

# Try to commit (bad formatting)
git add .
git commit -m "test: add logging"

# ❌ Husky blocks it:
# - ESLint detects console.log
# - Prettier fixes formatting
# - You need to fix the issues

# Fix the code, then try again
git add .
git commit -m "test: add logging"  # ✅ Now it passes
```

---

## 🚀 CI/CD Pipeline (Automatic on Git Push)

When you push to GitHub, these run automatically:

```yaml
GitHub Actions
  ├─ Backend Job
  │  ├─ Install dependencies
  │  ├─ Run ESLint
  │  └─ Run Jest tests
  │
  ├─ Frontend Job
  │  ├─ Install dependencies
  │  ├─ Run ESLint
  │  └─ Build Next.js
  │
  └─ AI Service Job
     ├─ Install Python dependencies
     ├─ Verify API imports
     └─ Test model predictions
```

**Result:**
- ✅ All pass → Render auto-deploys
- ❌ Any fail → Deployment blocked (fix & retry)

---

## 🏥 Health Check Scripts

### PowerShell (Windows)
```powershell
# Run health check
.\health-check.ps1

# Output:
# ✅ Backend is healthy
# ✅ AI Service is healthy
# ✅ Frontend is responsive
# ✅ All services are healthy!
```

### Bash (Linux/Mac)
```bash
# Run health check
bash health-check.sh

# Output:
# ✅ Backend is healthy
# ✅ AI Service is healthy
# ✅ Frontend is responsive
# ✅ All services are healthy!
```

---

## 📋 File Structure Summary

```
hachakton1/
├── .env.example                    # ← Environment template (NEW)
├── .lintstagedrc.json              # ← Lint config (NEW)
├── .husky/
│   └── pre-commit                  # ← Git hook (NEW)
├── CONTRIBUTING.md                 # ← Dev guide (NEW)
├── health-check.ps1                # ← Windows health check (NEW)
├── health-check.sh                 # ← Linux health check (NEW)
│
├── backend/
│   ├── jest.config.js              # ← Jest config (NEW)
│   ├── package.json                # ← Updated with Husky
│   └── tests/
│       ├── setup.js                # ← Jest setup (NEW)
│       ├── api.test.js
│       ├── auth.test.js
│       └── db.test.js
│
├── frontend/
│   └── package.json                # ← Updated with Husky
│
└── ai-service/
    ├── pytest.ini                  # ← Pytest config (NEW)
    ├── requirements.txt            # ← Updated with test deps
    ├── requirements-dev.txt        # ← Dev dependencies (NEW)
    └── tests/
        ├── test_model.py           # ← Model tests (NEW)
        └── test_api.py             # ← API tests (NEW)
```

---

## 🆘 Troubleshooting

### Husky Hook Not Running
```bash
# Reinstall Husky
cd backend && npm install && npm run prepare
cd ../frontend && npm install && npm run prepare
```

### Tests Fail Locally but Pass in CI
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Reinstall
npm test
```

### Pre-commit Hook Blocks Valid Code
```bash
# Bypass (only for emergency, not recommended)
git commit --no-verify

# Better: Fix the linting issues
cd backend && npm run lint && npm run format
```

### AI Tests Not Found
```bash
# Install test dependencies
cd ai-service
pip install pytest pytest-cov httpx
```

---

## 📞 Commands Cheat Sheet

```bash
# Backend
npm run start      # Start server
npm run lint       # Check code style
npm run format     # Auto-format code
npm test           # Run tests
npm run prepare    # Setup Husky

# Frontend
npm run dev        # Start dev server
npm run build      # Build production
npm run lint       # Check code
npm run format     # Format code

# AI Service
uvicorn api:app --reload          # Start dev
pytest tests/ -v                  # Run tests
pip install -r requirements.txt   # Install deps
```

---

## ✅ Verification Checklist

- [ ] Installed `npm install` in backend & frontend
- [ ] Installed Python packages in ai-service
- [ ] Created `.env` from `.env.example`
- [ ] Husky hooks installed (`npm run prepare`)
- [ ] Backend tests pass (`npm test`)
- [ ] AI tests pass (`pytest tests/`)
- [ ] Health check passes (`./health-check.ps1` or `bash health-check.sh`)
- [ ] Can make a test commit (triggers Husky hook)

---

## 🎉 You're All Set!

Your project now has:
- ✅ Automated testing on commit
- ✅ Automated testing on push
- ✅ Code quality enforcement
- ✅ Health monitoring
- ✅ Complete documentation

**Happy coding! 🚀**
