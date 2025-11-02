# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




🛒 FamilyKart - E-Commerce Frontend
📋 Table of Contents
🌟 Project Overview

🚀 Features

🛠️ Tech Stack

📁 Project Structure

⚙️ Installation & Setup

🎯 How to Run

📱 Pages & Components

🎨 Styling & Theming

🔄 State Management

🔐 Authentication Flow

🧪 API Integration

📦 Deployment

👨‍💻 Development Guide

🤝 Contributing

🌟 Project Overview
FamilyKart is a modern, responsive e-commerce web application built with React.js that provides a seamless shopping experience with dark/light theme support, user authentication, shopping cart functionality, and admin dashboard.

🎯 Key Highlights
✨ Modern UI/UX with smooth animations

🌙 Dark/Light Theme toggle

🔐 JWT Authentication

🛒 Shopping Cart with persistent storage

👨‍💼 Admin Dashboard for product/order management

📱 Fully Responsive design

⚡ Redux Toolkit for state management

🎭 Role-based Access Control

🚀 Features
👤 User Features
✅ User Registration & Login

👤 User Profile Management

🛍️ Product Browsing & Search

🔍 Advanced Filtering (Category, Price, Rating)

❤️ Add to Favorites

🛒 Add to Cart & Quantity Management

📦 Order Placement & History

📍 Location-based Address Detection

💳 Multiple Payment Methods

👨‍💼 Admin Features
📊 Admin Dashboard with Statistics

📦 Product Management (CRUD)

📋 Order Management

👥 User Cart Monitoring

🔒 Protected Admin Routes

🛠️ Tech Stack
Frontend Technologies
markdown
- ⚛️ **React.js** - Frontend Framework
- 🎨 **Tailwind CSS** - Styling & UI
- 🔄 **Redux Toolkit** - State Management
- 🛣️ **React Router** - Navigation
- 🎭 **Context API** - Theme & Auth Management
- 📡 **Axios** - API Communication
- 🔔 **React Hot Toast** - Notifications
- ✨ **AOS** - Animation Library
- 🎯 **React Icons** - Icon Library
📁 Project Structure
text
src/
├── 📂 app/
│   └── store.js                 # Redux store configuration
├── 📂 components/
│   ├── Navbar.jsx              # Main navigation component
│   ├── ProductCard.jsx         # Product display card
│   ├── ProtectedRoute.jsx      # Route protection for users
│   └── AdminRoute.jsx          # Route protection for admins
├── 📂 context/
│   ├── AuthContext.jsx         # Authentication context
│   ├── CartContext.jsx         # Shopping cart context
│   └── ThemeContext.jsx        # Theme management context
├── 📂 features/
│   ├── 📂 products/
│   │   └── productsApiSlice.js # RTK Query for products
│   └── 📂 orders/
│       └── ordersApiSlice.js   # RTK Query for orders
├── 📂 pages/
│   ├── Home.jsx                # Product listing page
│   ├── Login.jsx               # User login
│   ├── Register.jsx            # User registration
│   ├── Profile.jsx             # User profile management
│   ├── Cart.jsx                # Shopping cart
│   ├── Order.jsx               # Order history
│   ├── AdminDashboard.jsx      # Admin dashboard
│   ├── AdminProducts.jsx       # Product management
│   ├── AdminAddProduct.jsx     # Add new product
│   ├── AdminOrders.jsx         # Order management
│   └── Logout.jsx              # Logout confirmation
├── 📂 services/
│   └── api.js                  # API service configuration
├── App.jsx                     # Main app component
└── main.jsx                    # App entry point
⚙️ Installation & Setup
Prerequisites
Node.js (v14 or higher)

npm or yarn package manager

Git for version control

Step-by-Step Installation
📥 Clone the Repository

bash
git clone https://github.com/your-username/familykart-frontend.git
cd familykart-frontend
📦 Install Dependencies

bash
npm install
# or
yarn install
⚙️ Environment Configuration
Create a .env file in the root directory:

env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_ADMIN_SECRET_CODE=your_admin_secret_code
🔧 Development Server Setup

bash
npm start
# or
yarn start
The application will open at http://localhost:3000

🎯 How to Run
🏃‍♂️ Development Mode
bash
npm run dev
# Starts development server with hot reload
🏗️ Production Build
bash
npm run build
# Creates optimized production build
🧪 Testing
bash
npm test
# Runs test suite
📦 Build Analysis
bash
npm run build -- --analyze
# Analyzes bundle size
📱 Pages & Components
🏠 Home Page (Home.jsx)
Product listing with search and filters

Category-based filtering

Price range filtering

Rating-based sorting

Responsive grid layout

🔐 Authentication Pages
Login.jsx - User authentication

Register.jsx - New user registration with role selection

Password validation with real-time feedback

👤 User Pages
Profile.jsx - User profile management

Cart.jsx - Shopping cart with quantity controls

Order.jsx - Order history and tracking

👨‍💼 Admin Pages
AdminDashboard.jsx - Overview with statistics

AdminProducts.jsx - Product CRUD operations

AdminAddProduct.jsx - Add new products

AdminOrders.jsx - Order management

🎨 Styling & Theming
Tailwind CSS Configuration
Custom color palette

Dark mode support

Responsive breakpoints

Animation utilities

Theme Context
javascript
// Theme switching functionality
const { darkMode, toggleTheme } = useTheme();
Dynamic Styling
jsx
className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
🔄 State Management
Redux Store Structure
javascript
{
  products: [],      // Product data from API
  cart: [],         // Shopping cart items
  auth: {           // Authentication state
    user: null,
    token: null
  },
  theme: {          // UI theme
    darkMode: false
  }
}
RTK Query Slices
productsApiSlice - Product data fetching

ordersApiSlice - Order management

🔐 Authentication Flow
1. Registration
javascript
// User registration with role selection
const result = await register(userData);
2. Login
javascript
// JWT token authentication
const { data } = await authAPI.login({ email, password });
3. Protected Routes
jsx
<ProtectedRoute>
  <UserComponent />
</ProtectedRoute>

<AdminRoute>
  <AdminComponent />
</AdminRoute>
4. Logout
javascript
// Clear local storage and context
localStorage.removeItem('token');
setUser(null);
🧪 API Integration
API Service Structure
javascript
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const productsAPI = {
  getAll: (params) => API.get('/products', { params })
};
Request Interceptors
javascript
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
📦 Deployment
Vercel Deployment
Build the project

bash
npm run build
Deploy to Vercel

bash
npm i -g vercel
vercel --prod
Netlify Deployment
Connect GitHub repository

Set build command: npm run build

Set publish directory: build

Environment Variables for Production
env
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
REACT_APP_ADMIN_SECRET_CODE=production_secret_code
👨‍💻 Development Guide
Adding New Features
Create component in appropriate directory

Add route in App.jsx

Update navigation in Navbar.jsx

Add API calls in relevant service file

Test thoroughly

Code Style Guidelines
Use functional components with hooks

Follow consistent naming conventions

Implement proper error handling

Write responsive designs

Add loading states

Best Practices
✅ Use React hooks properly

✅ Implement proper prop validation

✅ Follow component composition

✅ Use context for global state

✅ Implement error boundaries

✅ Write accessible HTML

🤝 Contributing
Development Workflow
Fork the repository

Create feature branch

bash
git checkout -b feature/amazing-feature
Commit changes

bash
git commit -m 'Add amazing feature'
Push to branch

bash
git push origin feature/amazing-feature
Open Pull Request

Code Review Process
✅ All tests pass

✅ Code follows style guidelines

✅ Documentation updated

✅ No console errors

✅ Responsive design tested

📞 Support & Contact
For support, email your-email@domain.com or join our Slack channel.

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

<div align="center">
🎉 Happy Coding! Let's build amazing e-commerce experiences together! 🚀
⭐ Don't forget to star the repository if you find this project helpful!