// js/auth.js

import { auth, db } from "./firebase-config.js";
import { sendEmail } from './send-email.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Get current path to detect which page we're on
const path = window.location.pathname;

// 🔐 Login Page Logic
if (path.includes("index.html")) {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const role = document.getElementById("loginRole").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Check role from Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === role) {
          window.location.href = role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
        } else {
          loginError.textContent = "❌ Incorrect role selected.";
        }
      } else {
        loginError.textContent = "❌ User data not found.";
      }
    } catch (error) {
      loginError.textContent = `⚠️ ${error.message}`;
    }
  });
}

// 📝 Registration Page Logic
if (path.includes("register.html")) {
  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const role = document.getElementById("registerRole").value;

    if (!role) {
      registerError.textContent = "Please select a valid role.";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        balance: 12  // initial cylinders
      });
      

sendEmail({
  to_name: name,
  to_email: email,
  subject: "Welcome to Gas Agency System!",
  message: `Hi ${name},\n\nThanks for registering! You have 12 cylinders for the year.\n\nRegards,\nGas Agency`
});


      // Redirect based on role
      window.location.href = role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
    } catch (error) {
      registerError.textContent = `⚠️ ${error.message}`;
    }
  });
}
