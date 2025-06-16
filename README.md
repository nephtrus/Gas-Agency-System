# 🛢️ Gas Agency System

A modern web-based gas booking system built using **HTML, CSS, JavaScript**, and **Firebase**. This platform allows users to book gas cylinders online, track booking history, and receive notifications. Admins can approve requests, manage users, and publish notices. All actions are logged for transparency and traceability.

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Firestore (NoSQL Database), Firebase Auth
- **Email Integration**: EmailJS for user notifications
- **Deployment**: Firebase Hosting

## 📌 Features

### 👤 User
- Register and Login securely
- Book gas cylinders instantly
- View payment options (Cash, Paytm QR)
- Track booking history
- View admin notices
- Get booking confirmation via email

### 🛠️ Admin
- View and manage all user accounts
- Approve or reject cylinder requests
- Set global notices for all users
- View system logs of all user/admin actions

## 🧪 Project Evaluation Metrics

- **Modular**: HTML, CSS, and JS are separated for each module
- **Safe**: Secure Firebase auth and scoped access (role-based)
- **Testable**: Each JS module is independently testable
- **Maintainable**: Easy to read, structured files, minimal coupling
- **Portable**: Runs the same on all environments (browser-based)

## 📁 Directory Structure

```
gas-agency-system/
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── user-dashboard.html
│   ├── admin-dashboard.html
│   ├── logs.html
│   ├── css/
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── register.css
│   │   ├── user-dashboard.css
│   │   ├── admin-dashboard.css
│   │   ├── logs.css
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── user-dashboard.js
│   │   ├── admin-dashboard.js
│   │   ├── logs.js
│   ├── assets/
│   │   └── paytm-qr.png
├── .firebaserc
├── firebase.json
├── README.md
```

## 🚀 Deployment Instructions (Firebase Hosting)

> Ensure you have Node.js and Firebase CLI installed.

```bash
npm install -g firebase-tools
firebase login
firebase init
# Select Hosting and choose "public" as the folder
firebase deploy
```

**Live Link (example):**  
`https://gas-agency-system.web.app`

## 🧪 Sample Test Cases

| Feature                | Test Scenario                           | Expected Result                        |
|------------------------|-----------------------------------------|----------------------------------------|
| User Registration      | New user signs up                       | Account created in Firebase Auth       |
| Login Auth             | Correct credentials entered             | Redirect to respective dashboard       |
| Booking Flow           | Click on Book Cylinder                  | New entry in Firestore + email sent    |
| Admin Approve Request  | Admin clicks "Approve" on request       | Status updated + log added             |
| Notice Update          | Admin sets global notice                | Reflected in all user dashboards       |

## 🔐 Firebase Setup Instructions

> Refer to `js/firebase-config.js`  
Replace placeholders with your Firebase credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 📝 License

This project is developed for academic and learning purposes under an open-use license.

## 🙌 Acknowledgments

Thanks to [Firebase](https://firebase.google.com/) and [EmailJS](https://www.emailjs.com/) for their robust APIs and services.