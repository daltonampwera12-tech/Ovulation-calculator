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
  },

  es: {
    hero_title: "Calcula tu ovulación",
    hero_subtitle:
      "Controla tus días fértiles con una calculadora de ovulación suave y femenina diseñada para tu ciclo.",
    how_it_works_title: "Cómo funciona esta calculadora de ovulación",
    how_it_works_text:
      "Ingresa el primer día de tu último período, la duración promedio de tu ciclo y la duración de tu período. Calculamos tu día de ovulación, tu ventana fértil y generamos un calendario de fertilidad de 3 meses.",
    calculator_title: "Detalles de tu ciclo",
    label_last_period: "Fecha del último período",
    label_cycle_length: "Duración del ciclo (días)",
    label_period_length: "Duración del período (días)",
    button_calculate: "Calcular",
    result_ovulation_label: "Tu fecha estimada de ovulación es:",
    result_fertile_window_label: "Tu ventana fértil es:",
    calendar_title: "Tu calendario de fertilidad de 3 meses",
    seo_section_title: "Un compañero suave de ovulación y fertilidad",
    seo_section_text:
      "Esta calculadora de ovulación ofrece una forma suave y de apoyo para comprender tu ciclo. No reemplaza el consejo médico profesional, pero puede ayudarte a sentirte más en sintonía con tus días fértiles.",
    nav_home: "Inicio",
    nav_privacy: "Política de privacidad",
    nav_terms: "Términos de uso",
    nav_contact: "Contacto",
    nav_about: "Acerca de",
    nav_faq: "Preguntas frecuentes",
    nav_blog: "Blog",
    footer_disclaimer:
      "Esta herramienta es solo para fines informativos y no reemplaza el consejo médico profesional."
  },

  fr: {
    hero_title: "Calculez votre ovulation",
    hero_subtitle:
      "Suivez vos jours fertiles avec une calculatrice d’ovulation douce et féminine conçue pour votre cycle.",
    how_it_works_title: "Comment fonctionne cette calculatrice d’ovulation",
    how_it_works_text:
      "Entrez le premier jour de vos dernières règles, la durée moyenne de votre cycle et la durée de vos règles. Nous estimons votre jour d’ovulation, votre fenêtre fertile et générons un calendrier de fertilité sur 3 mois.",
    calculator_title: "Les détails de votre cycle",
    label_last_period: "Date des dernières règles",
    label_cycle_length: "Durée du cycle (jours)",
    label_period_length: "Durée des règles (jours)",
    button_calculate: "Calculer",
    result_ovulation_label: "Votre date d’ovulation estimée est :",
    result_fertile_window_label: "Votre fenêtre fertile est :",
    calendar_title: "Votre calendrier de fertilité sur 3 mois",
    seo_section_title: "Un compagnon doux pour l’ovulation et la fertilité",
    seo_section_text:
      "Cette calculatrice d’ovulation offre une manière douce et rassurante de comprendre votre cycle. Elle ne remplace pas un avis médical professionnel, mais elle peut vous aider à mieux ressentir vos jours fertiles.",
    nav_home: "Accueil",
    nav_privacy: "Politique de confidentialité",
    nav_terms: "Conditions d’utilisation",
    nav_contact: "Contact",
    nav_about: "À propos",
    nav_faq: "FAQ",
    nav_blog: "Blog",
    footer_disclaimer:
      "Cet outil est fourni à titre informatif uniquement et ne remplace pas un avis médical professionnel."
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

/* ---------------------------
   PERMANENT INSTALL BUTTON
---------------------------- */

let deferredPrompt;

// Listen for the install prompt event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Permanent install button logic
document.getElementById("installAppPermanent").addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert("To install the app, use your browser menu and choose 'Add to Home Screen'.");
  }
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Track that the install prompt was shown
  gtag('event', 'pwa_install_prompt_shown');
});

// When user actually installs the app
window.addEventListener('appinstalled', () => {
  gtag('event', 'pwa_installed');
});
