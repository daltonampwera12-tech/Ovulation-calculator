/* ---------------------------
   TRANSLATIONS
---------------------------- */

const translations = {
  en: {
    hero_title: "Calculate Your Ovulation",
    hero_subtitle:
      "Gently track your fertile days with a soft, feminine ovulation calculator designed for your cycle.",
    how_it_works_title: "How this ovulation calculator works",
    how_it_works_text:
      "Enter the first day of your last period, your average cycle length, and your period length. We estimate your ovulation day, fertile window, and generate a 3‑month fertility calendar.",
    calculator_title: "Your cycle details",
    label_last_period: "Last period date",
    label_cycle_length: "Cycle length (days)",
    label_period_length: "Period length (days)",
    button_calculate: "Calculate",
    result_ovulation_label: "Your estimated ovulation date is:",
    result_fertile_window_label: "Your fertile window is:",
    calendar_title: "Your 3‑Month Fertility Calendar",
    seo_section_title: "A gentle ovulation and fertility companion",
    seo_section_text:
      "This ovulation calculator offers a soft, supportive way to understand your cycle. It does not replace medical advice, but it can help you feel more in tune with your fertile days and overall rhythm.",
    nav_home: "Home",
    nav_privacy: "Privacy Policy",
    nav_terms: "Terms of Use",
    nav_contact: "Contact",
    nav_about: "About",
    nav_faq: "FAQ",
    nav_blog: "Blog",
    footer_disclaimer:
      "This tool is for informational purposes only and does not replace professional medical advice."
  }
};

/* ---------------------------
   LANGUAGE SYSTEM
---------------------------- */

function setLanguage(lang) {
  localStorage.setItem("appLanguage", lang);

  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("appLanguage") || "en";
  document.getElementById("languageSelect").value = savedLang;
  setLanguage(savedLang);
});

/* ---------------------------
   THEME TOGGLE
---------------------------- */

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
});

/* ---------------------------
   CALCULATOR + CALENDAR
---------------------------- */

document.getElementById("calculateBtn").addEventListener("click", () => {
  const lastPeriod = document.getElementById("lastPeriod").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);
  const periodLength = parseInt(document.getElementById("periodLength").value);

  if (!lastPeriod || !cycleLength || !periodLength) return;

  const lpDate = new Date(lastPeriod);

  // Ovulation = cycleLength - 14
  const ovulationDate = new Date(lpDate);
  ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));

  // Fertile window
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  const options = { year: "numeric", month: "short", day: "numeric" };

  document.getElementById("ovulationDate").textContent =
    ovulationDate.toLocaleDateString(undefined, options);

  document.getElementById("fertileWindow").textContent =
    fertileStart.toLocaleDateString(undefined, options) +
    " - " +
    fertileEnd.toLocaleDateString(undefined, options);

  generateThreeMonthCalendar(lpDate, cycleLength, periodLength);

  /* ⭐ SAVE VALUES FOR REMINDER ⭐ */
  const nextPeriod = new Date(lpDate);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

  window.calculatedNextPeriod = nextPeriod.toLocaleDateString(undefined, options);
  window.calculatedOvulation = ovulationDate.toLocaleDateString(undefined, options);

  /* ⭐ SHOW REMINDER BOX ⭐ */
  document.getElementById("reminder-box").style.display = "block";
});

/* ---------------------------
   3-MONTH ROLLING PREDICTION
---------------------------- */

function generateThreeMonthCalendar(startDate, cycleLength, periodLength) {
  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";

  const fertileDays = [];
  const ovulationDays = [];
  const periodDays = [];

  let currentPeriodStart = new Date(startDate);

  for (let cycle = 0; cycle < 3; cycle++) {
    let cycleStart = new Date(currentPeriodStart);

    // Period days
    for (let i = 0; i < periodLength; i++) {
      const d = new Date(cycleStart);
      d.setDate(d.getDate() + i);
      periodDays.push(d.toDateString());
    }

    // Ovulation
    const ovulation = new Date(cycleStart);
    ovulation.setDate(ovulation.getDate() + (cycleLength - 14));
    ovulationDays.push(ovulation.toDateString());

    // Fertile window
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    let d = new Date(fertileStart);
    while (d <= fertileEnd) {
      fertileDays.push(d.toDateString());
      d = new Date(d.getTime() + 86400000);
    }

    currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
  }

  const firstMonth = new Date(startDate);
  for (let i = 0; i < 3; i++) {
    const monthDate = new Date(firstMonth);
    monthDate.setMonth(monthDate.getMonth() + i);

    container.appendChild(
      createMonthCalendar(monthDate, fertileDays, ovulationDays, periodDays)
    );
  }
}

/* ---------------------------
   CREATE A SINGLE MONTH
---------------------------- */

function createMonthCalendar(date, fertileDays, ovulationDays, periodDays) {
  const monthDiv = document.createElement("div");
  monthDiv.className = "calendar-month";

  const monthName = date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const title = document.createElement("h3");
  title.textContent = monthName;
  monthDiv.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const dayNames = [];
  for (let i = 0; i < 7; i++) {
    dayNames.push(
      new Date(2024, 0, i + 1).toLocaleDateString(undefined, {
        weekday: "short",
      })
    );
  }

  dayNames.forEach((d) => {
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.style.fontWeight = "bold";
    grid.appendChild(cell);
  });

  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  for (let i = 0; i < first.getDay(); i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const day = new Date(date.getFullYear(), date.getMonth(), d);
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = d;

    const key = day.toDateString();

    if (periodDays.includes(key)) cell.classList.add("period-day");
    else if (ovulationDays.includes(key)) cell.classList.add("ovulation-day");
    else if (fertileDays.includes(key)) cell.classList.add("fertile-day");

    grid.appendChild(cell);
  }

  monthDiv.appendChild(grid);
  return monthDiv;
}

/* ---------------------------
   INSTALL BUTTON
---------------------------- */

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

document.getElementById("installAppPermanent").addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert("To install the app, use your browser menu and choose 'Add to Home Screen'.");
  }
});

/* ---------------------------
   REMINDER SYSTEM
---------------------------- */

function setReminder(lastPeriodStr, cycleLength, daysBefore, nextPeriodStr, ovulationStr) {
  const lastPeriod = new Date(lastPeriodStr + "T00:00:00");
  if (isNaN(lastPeriod.getTime())) return;

  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

  const reminderDate = new Date(nextPeriod);
  reminderDate.setDate(reminderDate.getDate() - daysBefore);

  const y = reminderDate.getFullYear();
  const m = String(reminderDate.getMonth() + 1).padStart(2, "0");
  const d = String(reminderDate.getDate()).padStart(2, "0");
  const reminderStr = `${y}-${m}-${d}`;

  localStorage.setItem("oc_reminderDate", reminderStr);
  localStorage.setItem("oc_nextPeriod", nextPeriodStr);
  localStorage.setItem("oc_ovulation", ovulationStr);

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "REMINDER_DATA",
      reminderDate: reminderStr,
      nextPeriod: nextPeriodStr,
      ovulation: ovulationStr
    });
  }

  alert("Your reminder has been set.");
}

document.getElementById("set-reminder-btn").addEventListener("click", () => {
  const lastPeriodStr = document.getElementById("lastPeriod").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);

  const daysBefore = Number(
    document.querySelector("input[name='days-before']:checked").value
  );

  const nextPeriodStr = window.calculatedNextPeriod;
  const ovulationStr = window.calculatedOvulation;

  setReminder(lastPeriodStr, cycleLength, daysBefore, nextPeriodStr, ovulationStr);
});

/* --------------------------------------------------
   TRIGGER 3-DAY GENTLE NOTIFICATIONS
-------------------------------------------------- */

function sendTipCheckToSW() {
  const lastTipDate = localStorage.getItem("oc_lastTipDate") || null;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "TIP_DATA",
      lastTipDate: lastTipDate
    });
  }
}

// When the service worker sends a tip, update localStorage
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TIP_SENT") {
    localStorage.setItem("oc_lastTipDate", event.data.date);
  }
});

// Trigger check whenever the user is online
window.addEventListener("online", sendTipCheckToSW);

// Trigger check on page load
window.addEventListener("load", sendTipCheckToSW);

/* --------------------------------------------------
   SHARE THE APP BUTTON
-------------------------------------------------- */

const shareBtn = document.getElementById("shareAppBtn");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Ovulation Calculator",
      text: "I found this gentle ovulation calculator. It’s soft, simple, and really helpful. Try it 💕",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback for browsers that don't support sharing
      alert("Sharing is not supported on this device.");
    }
  });
}
