# 🏆 Hackathon Technical Presentation Guide (The "Cheat Sheet")

Keep this file open during the judge's visit. It tells you exactly where to click and what to say.

## 1. Showing the BACKEND (Node.js/Express)
Open these files to show the "Logic":

- **Main Server Entry**: [server.js](file:///d:/hachakton1/backend/server.js)
    - *Say*: "This is our entry point. It connects to MongoDB Atlas and initializes our real-time WebSocket notifications."
- **API Routes**: [routes/wasteRoutes.js](file:///d:/hachakton1/backend/routes/wasteRoutes.js)
    - *Say*: "Each feature has its own API route. This one handles waste logging, categorization, and the photo upload logic."
- **Services (Real-time)**: [services/notificationService.js](file:///d:/hachakton1/backend/services/notificationService.js)
    - *Say*: "We implemented a custom socket service to push live alerts to users when donations or expiry warnings occur."

## 2. Showing the DATABASE (MongoDB)
Open these files to show the "Data Structure" (Schemas):

- **Waste Schema**: [models/Waste.js](file:///d:/hachakton1/backend/models/Waste.js)
    - *Say*: "We use a NoSQL approach (MongoDB) for flexibility. Here we store the weight, category, and the Geolocation tags."
- **Inventory Schema**: [models/Inventory.js](file:///d:/hachakton1/backend/models/Inventory.js)
    - *Say*: "Our inventory model supports batch identifiers and automated expiry alerting logic."

## 3. High-Level Talking Points (The "Win" Factors)
If the judges ask about:
- **Security**: *"We use JWT (JSON Web Tokens) and bcrypt for secure user authentication and role-based access control."*
- **Real-time**: *"The app is fully event-driven using Socket.io for instant canteen-to-NGO notifications."*
- **Analytics**: *"Our frontend performs advanced data aggregation for demand forecasting and financial impact ROI calculation."*
- **Scale**: *"Because we chose Node.js and MongoDB, the system can horizontally scale to handle hundreds of canteens simultaneously."*
- **DevOps/CI-CD**: *"We've implemented a professional CI/CD pipeline using GitHub Actions to automate testing and building on every code change."*

## 4. Showing ELITE ENGINEERING Standards
Open these to show "Production Readiness":

- **Automated Tests**: [tests/api.test.js](file:///d:/hachakton1/backend/tests/api.test.js)
    - *Say*: "We don't just write code; we verify it. We have a full suite of Jest and Supertest integration tests for our APIs."
- **CI/CD Workflow**: [.github/workflows/main.yml](file:///d:/hachakton1/.github/workflows/main.yml)
    - *Say*: "This is our GitHub Actions configuration. It ensures that every single Pull Request is linted, tested, and built before it can reach production."
- **Code Quality**: [.eslintrc.json](file:///d:/hachakton1/backend/.eslintrc.json)
    - *Say*: "We enforce industry-standard linting and formatting rules via Prettier and Husky pre-commit hooks to keep our codebase clean and bug-free."
**Remember**: Stay confident! Your project is technically very strong and covers the entire full-stack lifecycle. Good luck! 🎉
