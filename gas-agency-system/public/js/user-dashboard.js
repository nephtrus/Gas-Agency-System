import { auth, db } from "./firebase-config.js";

import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  setDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✉️ EmailJS Send Function
function sendEmail({ to_name, to_email, subject, message }) {
  emailjs.send("service_0lvg8ip", "template_ne8qqvs", {
    to_name,
    to_email,
    subject,
    message
  })
  .then(() => {
    console.log("✅ Email sent!");
  })
  .catch((error) => {
    console.error("❌ Email failed:", error);
  });
}

// 🔗 DOM References
const userNameSpan = document.getElementById("userName");
const balanceCount = document.getElementById("balanceCount");
const bookBtn = document.getElementById("bookCylinderBtn");
const historyList = document.getElementById("bookingHistoryList");
const logoutBtn = document.getElementById("logoutBtn");
const noticeMessage = document.getElementById("noticeMessage");
const noticeText = document.getElementById("noticeText");

// ✅ Check Login and Load Data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists() && docSnap.data().role === "user") {
      const userData = docSnap.data();
      userNameSpan.textContent = userData.name || "User";
      balanceCount.textContent = userData.balance ?? 0;

      loadBookingHistory(user.uid);
      loadGlobalNotice();

      // 🎯 Attach Booking Event
      bookBtn.addEventListener("click", async () => {
        try {
          const bookingRef = collection(db, "users", user.uid, "bookings");
          await addDoc(bookingRef, {
            timestamp: serverTimestamp()
          });

          await addDoc(collection(db, "logs"), {
            uid: user.uid,
            action: "Cylinder booked",
            timestamp: serverTimestamp()
          });

          alert("✅ Booking successful!");
          sendEmail({
            to_name: user.displayName || user.email,
            to_email: user.email,
            subject: "Cylinder Booked Successfully!",
            message: `Hi, your gas cylinder has been booked. It will be delivered soon.`
          });

          loadBookingHistory(user.uid);
        } catch (err) {
          console.error("Booking failed", err);
          alert("Something went wrong!");
        }
      });

    } else {
      alert("Unauthorized access.");
      window.location.href = "index.html";
    }
  } else {
    window.location.href = "index.html";
  }
});

// 📜 Load Booking History
async function loadBookingHistory(uid) {
  try {
    const bookingRef = collection(db, "users", uid, "bookings");
    const querySnap = await getDocs(bookingRef);

    historyList.innerHTML = "";

    if (querySnap.empty) {
      historyList.innerHTML = "<li>No bookings yet.</li>";
      return;
    }

    querySnap.forEach(doc => {
      const booking = doc.data();
      const date = booking.timestamp?.toDate().toLocaleString() || "Unknown time";
      const li = document.createElement("li");
      li.textContent = `Booked on: ${date}`;
      historyList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load history", err);
    historyList.innerHTML = "<li>Error loading history</li>";
  }
}

// 📣 Load Global Notice Once
async function loadGlobalNotice() {
  try {
    const noticeRef = doc(db, "notices", "global");
    const docSnap = await getDoc(noticeRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      noticeMessage.textContent = data.message || "No current notices.";
    } else {
      noticeMessage.textContent = "No notice posted.";
    }
  } catch (err) {
    console.error("Error loading notice", err);
    noticeMessage.textContent = "Failed to fetch notice.";
  }
}

// 🔔 Real-time notice updates
const noticeRef = doc(db, "notices", "global");
onSnapshot(noticeRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    noticeText.textContent = data.message || "No notices at the moment.";
  }
});

// 🚪 Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      console.error("Logout failed", err);
    });
});
