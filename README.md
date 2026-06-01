# 🏥 Care.IO - Premium Caregiving Services Platform

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-success?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-blue?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

Care.IO is a comprehensive, full-stack caregiving service platform built with Next.js App Router. It connects users with certified caregivers, offering seamless booking, secure payments, and role-based administrative controls wrapped in a premium, highly animated user interface.

🔗 **Live Preview:** [https://care-io-psi.vercel.app/](https://care-io-psi.vercel.app/)

---

## ✨ Key Features

### 👤 For Users:

- **Seamless Authentication:** Secure JWT-based login and registration (HTTP-only cookies).
- **Premium UI/UX:** Smooth scroll animations via **Framer Motion** and a custom "Dim Slate" dark/light mode toggle.
- **Service Booking:** Date, time, and location-based dynamic booking system.
- **Secure Payments:** Integrated **Stripe Checkout** for processing premium caregiving service fees safely.
- **Personalized Dashboard:** Manage personal information and track booking statuses (Pending/Paid) in real-time.

### 👑 For Administrators:

- **Advanced Analytics Dashboard:** Real-time data visualization using **Recharts** to track total revenue, daily growth percentages, and recent bookings.
- **Service Management (CRUD):** Easily add, update, or remove caregiving services directly from the dashboard using secure API routes.
- **Order Management:** Monitor user bookings and transaction statuses.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS v4, Shadcn UI
- **Backend:** Next.js API Routes (Serverless), Node.js
- **Database:** MongoDB, Mongoose
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Payment Gateway:** Stripe
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## 🚀 Development Workflow & Architecture

This application was engineered with a focus on modern development practices, utilizing **AI-assisted coding and advanced prompt engineering** to accelerate the development lifecycle. This approach enabled rapid prototyping, clean component-based architecture, and highly efficient debugging, ensuring a production-ready application with robust features.

---

## 💻 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Database URI
- Stripe Account (for API keys)

### Installation

1. **Clone the repository:**

```bash
   git clone [https://github.com/your-username/care-io.git](https://github.com/your-username/care-io.git)
   cd care-io
   npm install
```

Set up Environment Variables:
Create a .env.local file in the root directory and add the following keys:

# Database

MONGODB_URI=your_mongodb_connection_string

# Authentication

JWT_SECRET=your_super_secret_jwt_key

# Stripe

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

npm run dev

Open http://localhost:3000 with your browser to see the result.

👨‍💻 Author
Md Ziaul Hoque Arafat

Full-Stack Developer (MERN / Next.js)

Email: [mdarafat3167@gmail.com](mailto:mdarafat3167@gmail.com)

LinkedIn: [https://www.linkedin.com/in/ziaul-hoque-arafat/](https://www.linkedin.com/in/ziaul-hoque-arafat/)

GitHub: [https://github.com/ziaulhoquearafat](https://github.com/ziaulhoquearafat)

If you find this project useful, please consider giving it a ⭐!
