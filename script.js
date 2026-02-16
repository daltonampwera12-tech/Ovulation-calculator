/* --------------------------------------------------
   AUTO-LOAD SAVED VALUES
-------------------------------------------------- */
window.onload = () => {
  if (localStorage.getItem("cycleLength")) {
    document.getElementById("cycleLength").value = localStorage.getItem("cycleLength");
  }
  if (localStorage.getItem("periodLength")) {
    document.getElementById("periodLength").value = localStorage.getItem("periodLength");
  }

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
};

/* --------------------------------------------------
   MAIN CALCULATION
-------------------------------------------------- */
document.getElementById("calculateBtn").addEventListener("click", () => {
  const lastPeriod = document.getElementById("lastPeriodDate").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);
  const periodLength = parseInt(document.getElementById("periodLength").value);

  if (!lastPeriod || !cycleLength || !periodLength) {
    alert("Please fill in all fields.");
    return;
  }

  // Save values automatically
  localStorage.setItem("cycleLength", cycleLength);
  localStorage.setItem("periodLength", periodLength);

  const startDate = new Date(lastPeriod);

  // Ovulation = 14 days before next period
  const ovulationDate = new Date(startDate);
  ovulationDate.setDate(startDate.getDate() + (cycleLength - 14));

  // Fertile window = ovulation - 5 days to ovulation + 1 day
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(ovulationDate.getDate() + 1);

  // Next period
  const nextPeriod = new Date(startDate);
  nextPeriod.setDate(startDate.getDate() + cycleLength);

  // Display results
  document.getElementById("ovulationResult").textContent = ovulationDate.toDateString();
  document.getElementById("fertileWindowResult").textContent =
    `${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`;
  document.getElementById("nextPeriodResult").textContent = nextPeriod.toDateString();

  // Build calendar
  generateCalendar(startDate, cycleLength, periodLength, ovulationDate, fertileStart, fertileEnd);
});

/* --------------------------------------------------
   CALENDAR GENERATION (MONDAY START)
-------------------------------------------------- */
function generateCalendar(startDate, cycleLength, periodLength, ovulationDate, fertileStart, fertileEnd) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay(); // 0 = Sunday
  startDay = startDay === 0 ? 6 : startDay - 1; // Convert to Monday-start

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty boxes before the 1st
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    empty.style.visibility = "hidden";
    calendar.appendChild(empty);
  }

  // Loop through days
  for (let day = 1; day <= daysInMonth; day++) {
    const box = document.createElement("div");
    box.classList.add("day");
    box.textContent = day;

    const current = new Date(year, month, day);

    // PERIOD DAYS
    const periodEnd = new Date(startDate);
    periodEnd.setDate(startDate.getDate() + periodLength - 1);

    if (current >= startDate && current <= periodEnd) {
      box.classList.add("period");
    }

    // FERTILE WINDOW
    if (current >= fertileStart && current <= fertileEnd) {
      box.classList.add("fertile");
    }

    // OVULATION DAY
    if (current.toDateString() === ovulationDate.toDateString()) {
      box.classList.add("ovulation");
    }

    // LUTEAL PHASE
    const lutealStart = new Date(ovulationDate);
    lutealStart.setDate(ovulationDate.getDate() + 1);

    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(startDate.getDate() + cycleLength);

    if (current >= lutealStart && current < nextPeriod) {
      box.classList.add("luteal");
    }

    // FOLLICULAR PHASE
    if (current > periodEnd && current < fertileStart) {
      box.classList.add("follicular");
    }

    calendar.appendChild(box);
  }
}

/* --------------------------------------------------
   SHARE BUTTON
-------------------------------------------------- */
const shareBtn = document.getElementById("shareBtn");
if (navigator.share && shareBtn) {
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Ovulation & Cycle Tracker",
      text: "Check out this soft, modern ovulation & cycle tracker.",
      url: window.location.href
    }).catch(() => {});
  });
} else if (shareBtn) {
  shareBtn.addEventListener("click", () => {
    alert("You can share this page by copying the link from your browser.");
  });
}

/* --------------------------------------------------
   THEME TOGGLE
-------------------------------------------------- */
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });
}

/* --------------------------------------------------
   SYMPTOMS NOTES
-------------------------------------------------- */
const symptomsField = document.getElementById("symptomsNotes");
const saveSymptomsBtn = document.getElementById("saveSymptoms");

const todayKey = `symptoms_${new Date().toISOString().slice(0,10)}`;
if (symptomsField && localStorage.getItem(todayKey)) {
  symptomsField.value = localStorage.getItem(todayKey);
}

if (saveSymptomsBtn && symptomsField) {
  saveSymptomsBtn.addEventListener("click", () => {
    localStorage.setItem(todayKey, symptomsField.value || "");
    alert("Saved for today.");
  });
}

/* --------------------------------------------------
   MULTI-LANGUAGE SYSTEM
-------------------------------------------------- */
const translations = {
  en: {
    title: "Ovulation & Fertility Tracker",
    subtitle: "Track your cycle, predict ovulation, and understand your fertile window with confidence.",
    cycleInfo: "Your Cycle Information",
    lastPeriod: "First day of your last period:",
    cycleLength: "Average cycle length (days):",
    periodLength: "Average period length (days):",
    calculate: "Calculate",
    results: "Your Results",
    ovulationDay: "Ovulation Day:",
    fertileWindow: "Fertile Window:",
    nextPeriod: "Next Period:",
    calendarTitle: "Your Cycle Calendar",
    legendPeriod: "Period",
    legendFollicular: "Follicular Phase",
    legendFertile: "Fertile Window",
    legendOvulation: "Ovulation",
    legendLuteal: "Luteal Phase",
    symptomsTitle: "Daily Symptoms & Notes",
    symptomsHint: "Write how you feel today to better understand your cycle patterns.",
    saveSymptoms: "Save today’s note",
    share: "Share this tracker",
    footerText: "Designed with care to help you understand your cycle.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Use"
  }
  // Other languages unchanged for brevity
};

document.getElementById("languagePicker").addEventListener("change", (e) => {
  const lang = e.target.value;
  applyLanguage(lang);
});

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key];
  });
}

/* --------------------------------------------------
   PWA INSTALL LOGIC
-------------------------------------------------- */
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Hide button until event fires
installBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "block";

  installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";
    deferredPrompt.prompt();

    deferredPrompt.userChoice.finally(() => {
      deferredPrompt = null;
    });
  });
});
