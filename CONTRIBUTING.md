# Contributing Guide 🚀

Thank you for contributing to **Smart Food Wastage Management System**! This document provides guidelines for development, testing, and deployment.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing](#testing)
5. [Committing Changes](#committing-changes)
6. [Pull Requests](#pull-requests)
7. [Deployment](#deployment)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **Python** 3.11+
- **MongoDB Atlas** account
- **Git**

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd hachakton1
```

2. **Copy environment variables**
```bash
cp .env.example .env
# Edit .env with your local values
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

5. **Install AI service dependencies**
```bash
cd ../ai-service
pip install -r requirements.txt
```

6. **Start all services**
```bash
# From project root
./start_all.bat  # Windows
# Or manually start each in separate terminals:
cd backend && npm start
cd frontend && npm run dev
cd ai-service && python -m uvicorn api:app --reload --port 8000
```

Services will run on:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **AI Service**: http://localhost:8000

---

## 📝 Development Workflow

### Branch Naming Convention

```bash
# Feature branches
git checkout -b feature/user-authentication

# Bug fix branches
git checkout -b bugfix/fix-inventory-validation

# Hotfix branches (production)
git checkout -b hotfix/critical-security-fix

# Documentation
git checkout -b docs/add-api-documentation
```

### Creating a Feature

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** in the relevant service:
   - Backend changes → `backend/`
   - Frontend changes → `frontend/`
   - AI changes → `ai-service/`

3. **Run tests locally**
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm run lint

# AI Service
cd ai-service && pytest tests/
```

4. **Lint and format code**
```bash
# Backend
cd backend && npm run lint && npm run format

# Frontend
cd frontend && npm run lint && npm run format
```

---

## ✅ Code Standards

### JavaScript/Node.js

- **Linter**: ESLint
- **Formatter**: Prettier
- **Style**: Use consistent naming (camelCase for variables/functions)
- **Comments**: Add JSDoc comments for functions

```javascript
/**
 * Calculate inventory expiry date
 * @param {Date} purchaseDate - Date item was purchased
 * @param {number} shelfLife - Days until expiry
 * @returns {Date} Expiry date
 */
function calculateExpiry(purchaseDate, shelfLife) {
  const expiryDate = new Date(purchaseDate);
  expiryDate.setDate(expiryDate.getDate() + shelfLife);
  return expiryDate;
}
```

### React/Next.js

- Use **functional components** with hooks
- Extract components into `components/` folder
- Use **meaningful prop names**
- Add error boundaries for error handling

```jsx
// ✅ Good
function InventoryCard({ itemName, quantity, expiryDate }) {
  return (
    <div className="inventory-card">
      <h3>{itemName}</h3>
      <p>Qty: {quantity}</p>
      <p>Expires: {new Date(expiryDate).toLocaleDateString()}</p>
    </div>
  );
}

// ❌ Avoid
function Card({ data }) {
  return <div>{data}</div>;
}
```

### Python

- **Linter**: Pylint (optional, but recommended)
- **Formatter**: Black (optional)
- **Docstrings**: Use Google-style docstrings

```python
def predict_meals(day: int, attendance: int) -> float:
    """
    Predict meal count based on day and attendance.
    
    Args:
        day: Day of week (1-7)
        attendance: Expected student attendance
    
    Returns:
        Predicted meal count as float
    
    Raises:
        ValueError: If day not in range 1-7
    """
    if not 1 <= day <= 7:
        raise ValueError("Day must be between 1 and 7")
    
    return model.predict([[day, attendance]])[0]
```

---

## 🧪 Testing

### Backend Tests (Jest)

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test tests/api.test.js

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm test -- --watch
```

**Test structure:**
```javascript
describe("Inventory API", () => {
  test("should add new item", async () => {
    const response = await request(app)
      .post("/api/inventory/add")
      .send({ item: "Apples", quantity: 50 });
    
    expect(response.status).toBe(200);
    expect(response.body.item).toBe("Apples");
  });
});
```

### Frontend Tests

```bash
cd frontend

# Lint check
npm run lint

# Build verification
npm run build
```

### AI Service Tests (Pytest)

```bash
cd ai-service

# Run all tests
pytest tests/

# Run with verbose output
pytest tests/ -v

# Run specific test
pytest tests/test_model.py::TestPrediction::test_predict_valid_day -v

# With coverage
pytest tests/ --cov=.
```

**Test structure:**
```python
def test_predict_valid_day():
    """Test prediction for valid day"""
    result = predict(1, 100)
    assert result is not None
    assert result > 0
```

---

## 📮 Committing Changes

### Commit Message Format

Follow **Conventional Commits** pattern:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Feature
git commit -m "feat(inventory): add expiry date validation"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(api): add endpoint documentation"

# Refactor
git commit -m "refactor(waste): optimize query performance"
```

### Pre-commit Checks

Before committing, the following run automatically:
- ✅ ESLint (backend & frontend)
- ✅ Prettier formatting
- ✅ Unit tests

---

## 🔄 Pull Requests

### Before Submitting

1. ✅ All tests pass locally
2. ✅ Code is formatted (`npm run format`)
3. ✅ No console.log statements in production code
4. ✅ Updated relevant documentation
5. ✅ Branch is up-to-date with `main`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
Describe how you tested:
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### CI/CD Pipeline

When you push, GitHub Actions automatically:
1. ✅ Installs dependencies
2. ✅ Runs linter
3. ✅ Runs tests
4. ✅ Verifies builds

**PR blocked if any check fails.**

---

## 🚀 Deployment

### Local Deployment (Render)

1. **Push to main branch**
```bash
git push origin main
```

2. **GitHub Actions runs tests**
   - If all pass → Render auto-deploys
   - If any fail → Deployment blocked

3. **Verify deployment**
```bash
# Check backend health
curl https://smart-food-backend.onrender.com/health

# Check AI service health
curl https://smart-food-ai-service.onrender.com/health

# Check frontend
Open: https://smart-food-frontend.onrender.com
```

### Setting Environment Variables on Render

1. Go to Render Dashboard
2. Select the service
3. Go to **Environment**
4. Add/update:
   - `MONGO_URI` (backend)
   - `JWT_SECRET` (backend)
   - `NEXT_PUBLIC_API_URL` (frontend)

---

## 🆘 Troubleshooting

### "npm test" fails locally

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Run again
npm test
```

### "MongoDB connection error"

```bash
# Verify MONGO_URI in .env
# Check MongoDB Atlas:
# - Cluster is running
# - IP whitelist includes your IP
# - Username/password correct
```

### "AI service prediction fails"

```bash
cd ai-service

# Check data file exists
ls data.csv

# Test model import
python -c "from model import predict; print(predict(1, 100))"
```

---

## 📞 Getting Help

- **Issues**: Create a GitHub issue with details
- **Questions**: Ask in team chat/meetings
- **Documentation**: Check README.md and TECHNICAL_GUIDE.md

---

## 🎉 Thank You!

Your contributions help make this project better. Happy coding! 🚀
