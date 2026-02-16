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
      "Sigue tus días fértiles con una calculadora de ovulación suave y femenina, diseñada para tu ciclo.",
    how_it_works_title: "Cómo funciona esta calculadora de ovulación",
    how_it_works_text:
      "Ingresa el primer día de tu último período, la duración de tu ciclo y la duración de tu período. Calculamos tu ovulación, ventana fértil y generamos un calendario de fertilidad de 3 meses.",
    calculator_title: "Detalles de tu ciclo",
    label_last_period: "Fecha de tu último período",
    label_cycle_length: "Duración del ciclo (días)",
    label_period_length: "Duración del período (días)",
    button_calculate: "Calcular",
    result_ovulation_label: "Tu fecha estimada de ovulación es:",
    result_fertile_window_label: "Tu ventana fértil es:",
    calendar_title: "Tu calendario de fertilidad de 3 meses",
    seo_section_title: "Un acompañante suave para tu fertilidad",
    seo_section_text:
      "Esta calculadora de ovulación ofrece una forma suave y comprensiva de entender tu ciclo. No reemplaza el consejo médico, pero puede ayudarte a sentirte más conectada con tus días fértiles.",
    nav_home: "Inicio",
    nav_privacy: "Política de privacidad",
    nav_terms: "Términos de uso",
    nav_contact: "Contacto",
    nav_about: "Acerca de",
    nav_faq: "Preguntas frecuentes",
    nav_blog: "Blog",
    footer_disclaimer:
      "Esta herramienta es solo informativa y no reemplaza el consejo médico profesional."
  },

  fr: {
    hero_title: "Calculez votre ovulation",
    hero_subtitle:
      "Suivez vos jours fertiles avec une calculatrice d’ovulation douce et féminine, adaptée à votre cycle.",
    how_it_works_title: "Comment fonctionne cette calculatrice d’ovulation",
    how_it_works_text:
      "Entrez le premier jour de vos dernières règles, la durée de votre cycle et la durée de vos règles. Nous estimons votre ovulation, votre fenêtre fertile et générons un calendrier de fertilité sur 3 mois.",
    calculator_title: "Les détails de votre cycle",
    label_last_period: "Date de vos dernières règles",
    label_cycle_length: "Durée du cycle (jours)",
    label_period_length: "Durée des règles (jours)",
    button_calculate: "Calculer",
    result_ovulation_label: "Votre date d’ovulation estimée est :",
    result_fertile_window_label: "Votre fenêtre fertile est :",
    calendar_title: "Votre calendrier de fertilité sur 3 mois",
    seo_section_title: "Un compagnon doux pour votre fertilité",
    seo_section_text:
      "Cette calculatrice d’ovulation offre une façon douce et rassurante de comprendre votre cycle. Elle ne remplace pas un avis médical, mais peut vous aider à mieux ressentir vos jours fertiles.",
    nav_home: "Accueil",
    nav_privacy: "Politique de confidentialité",
    nav_terms: "Conditions d’utilisation",
    nav_contact: "Contact",
    nav_about: "À propos",
    nav_faq: "FAQ",
    nav_blog: "Blog",
    footer_disclaimer:
      "Cet outil est fourni à titre informatif et ne remplace pas un avis médical professionnel."
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
   3-MONTH CALENDAR GENERATOR
---------------------------- */

function generateThreeMonthCalendar(startDate, cycleLength, periodLength) {
  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";

  const fertileDays = [];
  const ovulationDays = [];
  const periodDays = [];

  // Calculate ovulation + fertile window
  const ovulation = new Date(startDate);
  ovulation.setDate(ovulation.getDate() + (cycleLength - 14));

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  // Fill fertile days
  let d = new Date(fertileStart);
  while (d <= fertileEnd) {
    fertileDays.push(d.toDateString());
    d = new Date(d.getTime() + 86400000);
  }

  // Fill ovulation day
  ovulationDays.push(ovulation.toDateString());

  // Fill period days
  let p = new Date(startDate);
  for (let i = 0; i < periodLength; i++) {
    periodDays.push(p.toDateString());
    p.setDate(p.getDate() + 1);
  }

  // Generate 3 months
  for (let i = 0; i < 3; i++) {
    const monthDate = new Date(startDate);
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
