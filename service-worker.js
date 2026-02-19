// --------------------------------------------------
// Online‑First PWA Service Worker + Reminder System
// --------------------------------------------------

const SW_VERSION = "v14"; // bump this whenever you update

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

// --------------------------------------------------
// REMINDER SYSTEM
// --------------------------------------------------

let cachedReminderDate = null;
let cachedNextPeriod = null;
let cachedOvulation = null;

const messages = [
  "Hey, your reminder is here. See important days.",
  "Your cycle update is ready. Tap to view your important days.",
  "A new reminder is here. See your upcoming days.",
  "Your monthly reminder is ready. Tap to check your days.",
  "Your update is here. See your important cycle days."
];

// Receive reminder data from script.js
self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "REMINDER_DATA") {
    cachedReminderDate = data.reminderDate;
    cachedNextPeriod = data.nextPeriod;
    cachedOvulation = data.ovulation;

    checkAndNotify();
  }
});

// Helper: today's date in YYYY-MM-DD
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Main reminder check
function checkAndNotify() {
  if (!cachedReminderDate) return;

  const today = getTodayStr();
  if (today !== cachedReminderDate) return;

  const message = messages[Math.floor(Math.random() * messages.length)];
  const bodyText = `Period: ${cachedNextPeriod} • Ovulation: ${cachedOvulation}`;

  self.registration.showNotification(message, {
    body: bodyText,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  });

  // Prevent duplicate notifications
  cachedReminderDate = null;
}

/* --------------------------------------------------
   EVERY-3-DAYS GENTLE WELLNESS NOTIFICATIONS
-------------------------------------------------- */

let lastTipDate = null;

const gentleMessages = [
  "You deserve softness today. Be gentle with your heart.",
  "Take a slow breath. You are safe, you are held.",
  "Your feelings matter. Honor them today.",
  "You don’t have to be perfect. You just have to be you.",
  "Rest is not a luxury. It’s care. Give yourself a moment.",
  "You are allowed to slow down. Your body will thank you.",
  "Choose one tiny act of kindness for yourself today.",
  "Your presence is enough. You are enough.",
  "Let today be soft. Let yourself be soft.",
  "You deserve peace, even in small moments."
];

// Receive last tip date from script.js
self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "TIP_DATA") {
    lastTipDate = data.lastTipDate;
    checkAndSendTip();
  }
});

// Helper: today's date in YYYY-MM-DD
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Check if 3 days have passed
function checkAndSendTip() {
  const today = getTodayStr();

  if (!lastTipDate) {
    // First time ever → send a tip now
    sendGentleTip(today);
    return;
  }

  const last = new Date(lastTipDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");

  const diffDays = Math.floor((now - last) / 86400000);

  if (diffDays >= 3) {
    sendGentleTip(today);
  }
}

// Send the notification
function sendGentleTip(todayStr) {
  const message =
    gentleMessages[Math.floor(Math.random() * gentleMessages.length)];

  self.registration.showNotification("A gentle moment for you", {
    body: message,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  });

  // Save new last tip date
  lastTipDate = todayStr;
}

// --------------------------------------------------
// NETWORK-FIRST FETCH HANDLER
// --------------------------------------------------

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(() => {
        if (event.request.destination === "document") {
          return new Response(
            `<h1>You are offline</h1><p>Please reconnect to the internet to use this app.</p>`,
            { headers: { "Content-Type": "text/html" } }
          );
        } else {
          return new Response(
            "You are offline. Please reconnect to the internet.",
            { headers: { "Content-Type": "text/plain" } }
          );
        }
      })
  );
});
