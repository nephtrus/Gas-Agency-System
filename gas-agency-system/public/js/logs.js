import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔗 DOM
const logList = document.getElementById("logList");
const backBtn = document.getElementById("backBtn");

// 🔐 Ensure Admin is Logged In
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadLogs();
});

// 📄 Load Logs
async function loadLogs() {
  try {
    const logsRef = collection(db, "logs");
    const logsQuery = query(logsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(logsQuery);

    logList.innerHTML = "";

    if (querySnapshot.empty) {
      logList.innerHTML = "<li>No logs found.</li>";
      return;
    }

    querySnapshot.forEach(doc => {
      const log = doc.data();
      const date = log.timestamp?.toDate().toLocaleString() || "Unknown time";
      const li = document.createElement("li");
      li.textContent = `[${date}] ${log.uid}: ${log.action}`;
      logList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load logs", err);
    logList.innerHTML = "<li>Error loading logs</li>";
  }
}

// 🔙 Back Button
backBtn.addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});
