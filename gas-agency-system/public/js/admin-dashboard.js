import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔗 DOM Elements
const userList = document.getElementById("userList");
const postNoticeBtn = document.getElementById("postNoticeBtn");
const noticeInput = document.getElementById("noticeInput");
const logoutBtn = document.getElementById("logoutBtn");
const bookingRequests = document.getElementById("bookingRequests");

// ✅ Admin Authentication Check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDocs(collection(db, "users"));
    const adminSnap = await getDocs(collection(db, "users"));

    loadUsers();
    loadPendingBookings();
  } else {
    window.location.href = "index.html";
  }
});

// 🔁 Load Users
async function loadUsers() {
  try {
    const usersCol = collection(db, "users");
    const usersSnap = await getDocs(usersCol);
    userList.innerHTML = "";

    usersSnap.forEach((docSnap) => {
      const user = docSnap.data();
      if (user.role !== "admin") {
        const li = document.createElement("li");
        li.textContent = `${user.name || user.email} | Cylinders Left: ${user.balance}`;
        userList.appendChild(li);
      }
    });
  } catch (err) {
    console.error("Error loading users", err);
    userList.innerHTML = "<li>Error loading users</li>";
  }
}

// 📣 Post Notice
postNoticeBtn.addEventListener("click", async () => {
  const message = noticeInput.value.trim();
  if (!message) {
    alert("Please write a notice message!");
    return;
  }

  try {
    await setDoc(doc(db, "notices", "global"), {
      message,
      timestamp: serverTimestamp()
    });

    await addLog("Posted a global notice");
    alert("✅ Notice posted!");
    noticeInput.value = "";
  } catch (err) {
    console.error("Failed to post notice", err);
    alert("❌ Failed to post notice.");
  }
});

// 📦 Load Pending Bookings
async function loadPendingBookings() {
  try {
    const usersCol = collection(db, "users");
    const usersSnap = await getDocs(usersCol);
    bookingRequests.innerHTML = "";

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const bookingsRef = collection(db, "users", uid, "bookings");
      const bookingsSnap = await getDocs(bookingsRef);

      bookingsSnap.forEach(async (booking) => {
        const data = booking.data();
        const date = data.timestamp?.toDate().toLocaleString() || "Unknown";
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${userDoc.data().name || userDoc.data().email} - ${date}</span>
          <button class="approve">Approve</button>
          <button class="reject">Reject</button>
        `;

        // Handle Approval
        li.querySelector(".approve").addEventListener("click", async () => {
          await updateDoc(doc(db, "users", uid), {
            balance: (userDoc.data().balance || 0) - 1
          });
          await deleteDoc(doc(bookingsRef, booking.id));
          await addLog(`Approved booking for ${uid}`);
          li.remove();
        });

        // Handle Rejection
        li.querySelector(".reject").addEventListener("click", async () => {
          await deleteDoc(doc(bookingsRef, booking.id));
          await addLog(`Rejected booking for ${uid}`);
          li.remove();
        });

        bookingRequests.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Error loading bookings", err);
    bookingRequests.innerHTML = "<li>Error loading bookings</li>";
  }
}

// 🚪 Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => window.location.href = "index.html")
    .catch(err => console.error("Logout failed", err));
});

// 📝 Admin Logs
async function addLog(action) {
  await addDoc(collection(db, "logs"), {
    uid: auth.currentUser.uid,
    action,
    timestamp: serverTimestamp()
  });
}
