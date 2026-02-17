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

  // First ovulation = cycleLength - 14
  const ovulationDate = new Date(lpDate);
  ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));

  // Fertile window = ovulation -5 to ovulation +1
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

    // Next cycle start
    currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
  }

  // Generate 3 months
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

  // Day names
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

  // First day of month
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Empty cells
  for (let i = 0; i < first.getDay(); i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // Days
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
