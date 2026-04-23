# 🌱 Smart Food Waste Management System

![Banner](https://via.placeholder.com/1200x300.png?text=Smart+Food+Waste+Management+System)

## 📖 Overview

The **Smart Food Waste Management System** (Smart Food Save) is a comprehensive, full-stack platform designed to tackle food wastage in canteens and large-scale food services. By seamlessly connecting food producers (canteens) with distributors and NGOs, the platform ensures surplus food reaches those in need while optimizing inventory to prevent future waste. 

The system provides real-time notifications, a categorized inventory system, advanced analytics, and an interactive "Eco-Warrior" scoring mechanism to gamify and encourage sustainable practices.

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Dedicated interfaces and workflows for Admin, Staff, and NGO users.
*   **Categorized Inventory Management:** Track stock across multiple categories (Vegetables, Fruits, Dairy, Grains, Daily) with automated expiry alerts.
*   **Real-time Notifications:** Event-driven architecture using Socket.io instantly notifies NGOs when food is available for donation.
*   **Advanced Analytics & Reporting:** Interactive dashboards providing insights into waste patterns, demand forecasting, and financial/ecological ROI.
*   **Eco-Warrior Gamification:** Real-time scoring system that rewards canteens and staff for waste reduction and successful donations.
*   **AI-Powered Insights:** (Via dedicated AI service) Advanced data aggregation for demand forecasting and optimization.
*   **Elite UI/UX:** A highly responsive, dynamic "Elite Hybrid" aesthetic featuring dark mode, animations (Framer Motion), and seamless navigation.

## 🛠️ Technology Stack

Our platform is built using modern, robust, and scalable technologies:

### Frontend
*   **Framework:** Next.js (React 18)
*   **Styling:** Tailwind CSS, PostCSS
*   **Maps & Charts:** Leaflet, Chart.js (react-chartjs-2)
*   **Animations:** Framer Motion, Canvas Confetti
*   **State & Networking:** Axios, Socket.io-client

### Backend
*   **Environment:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Mongoose ORM)
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **Real-time:** Socket.io
*   **Utilities:** Multer (uploads), Nodemailer (emails), Node-cron (scheduled tasks)

### AI Service
*   **Framework:** FastAPI (Python)
*   **Machine Learning:** scikit-learn, pandas, joblib

### DevOps & Code Quality
*   **CI/CD:** GitHub Actions (Automated testing and building)
*   **Testing:** Jest, Supertest
*   **Linting/Formatting:** ESLint, Prettier, Husky (pre-commit hooks), lint-staged

## ⚙️ Local Development Setup

To run the application locally, follow these steps:

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/smart-food-waste-management-system.git
cd smart-food-waste-management-system
```

### 2. Install dependencies
Install root dependencies (for lint-staged and husky):
```bash
npm install
```
Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```
Install backend dependencies:
```bash
cd backend
npm install
cd ..
```
Install AI Service dependencies:
```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

### 3. Environment Variables
You will need to create `.env` files in both the `frontend` and `backend` directories. Refer to the `.env.example` file in the root directory for the required keys (e.g., `MONGO_URI`, `JWT_SECRET`, port configurations).

### 4. Start the Application
You can use the provided batch script to start all services simultaneously (Windows):
```bash
./start_all.bat
```
Alternatively, start them individually:
*   **Frontend:** `npm run dev` (inside `/frontend`)
*   **Backend:** `npm start` (inside `/backend`)
*   **AI Service:** `uvicorn main:app --reload` (inside `/ai-service`)

## 🧪 Testing

The backend includes a comprehensive suite of integration and unit tests using Jest and Supertest.

```bash
cd backend
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to submit pull requests, our branching strategy, and code style expectations. For a deeper dive into the architecture, check out the [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
