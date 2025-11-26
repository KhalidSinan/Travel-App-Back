# JourneyJoy ✈️🏨🌍

> This README covers **3 separate repositories**: JourneyJoy Flutter (mobile), JourneyJoy Web (React), and JourneyJoy Backend (Node.js/Express + MongoDB).

JourneyJoy is a complete travel app ecosystem that helps users plan, book, and manage their journeys. Whether you travel solo or with organized trips, JourneyJoy covers flights, hotels, and popular public places to visit.

---

## 🚀 Features

**Mobile (Flutter)**

* Flight booking ✈️ (one-way & round-trip)
* Hotel reservations 🏨
* Trip planning with organizers or solo 🗺️
* Explore popular public places 🌆
* Onboarding and user profile management 👤
* Chat and group trip communication 💬
* Notifications & reminders 🔔
* Payment support via PayPal and other gateways 💳
* Google Sign-In (mobile only) 🔑

**Web (React)**

* Admin/dashboard view 📊
* Flight & hotel data management
* Charts & analytics for trips & bookings 📈
* Data filtering and pagination
* Responsive design for desktop & mobile browsers

**Backend (Node.js + Express + MongoDB)**

* REST API with authentication & JWT 🔒
* User, organizer, and trip management
* Booking, reservation, and payment processing
* Firebase integration for notifications & messaging 🔔
* Email notifications with Nodemailer ✉️
* Real-time communication using Socket.IO 💬

---

## 🛠️ Tech Stack

| Layer         | Technology / Library                                          |
| ------------- | ------------------------------------------------------------- |
| Mobile        | Flutter, Dart, Bloc, GetIt, Firebase, Google Sign-In          |
| Web           | React, React Router, Material-UI, Recharts, Axios             |
| Backend       | Node.js, Express, MongoDB, Mongoose, JWT, Passport, Socket.IO |
| Notifications | Firebase Cloud Messaging, Flutter Local Notifications         |
| Payments      | PayPal SDK                                                    |
| Utilities     | Dio, Axios, Lottie, CachedNetworkImage, CarouselSlider        |

---

## ⚙️ State Management

* **Flutter (mobile)**: Bloc pattern (flutter_bloc) & GetX (Get)
* **React (web)**: React Router for routing, Context/hooks for state

---

## 📝 Setup & Running Instructions

### Backend

1. Clone the repo and navigate to backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your environment variables (MongoDB URI, JWT secret, Firebase credentials, etc.).
4. Seed sample data (optional):

   ```bash
   npm run seed
   ```
5. Start the server:

   ```bash
   npm start
   ```
6. Server runs at `http://localhost:5000` by default.

### Web (React)

1. Navigate to web folder:

   ```bash
   cd travelappweb
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start development server:

   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:3000`.

### Mobile (Flutter)

1. Navigate to Flutter project folder:

   ```bash
   cd travelapp_flutter
   ```
2. Install dependencies:

   ```bash
   flutter pub get
   ```
3. Run the app on emulator or device:

   ```bash
   flutter run
   ```
4. Make sure to configure Firebase for Android/iOS using your `google-services.json` / `GoogleService-Info.plist`.

---

## 📂 Folder Structure (Summary)

* `lib/features` – All mobile app features: auth, flights, hotels, trips, chat, settings.
* `lib/core` – Helpers, utilities, widgets, localization, and theming.
* `web` – React dashboard source code.
* `backend` – Node.js API with models, routes, controllers, and scripts.
* `assets` – Images, videos, animations.

---

## 📄 License

MIT License ✅

---

## 💡 Notes

* Mobile app is the main client. Web is for administrative/dashboard purposes.
* Firebase integration is used for notifications and messaging.
* Payments and email notifications are configured for both solo and organized trips.

---

Enjoy planning your adventures with **JourneyJoy**! 🧳✨
