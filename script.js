/* --------------------------------------------------
   ELEMENTS
-------------------------------------------------- */
const form = document.getElementById("ovulationForm");
const resultsSection = document.getElementById("results");
const loadingSkeleton = document.getElementById("loadingSkeleton");

const ovulationDateEl = document.getElementById("ovulationDate");
const fertileWindowEl = document.getElementById("fertileWindow");
const nextPeriodEl = document.getElementById("nextPeriod");
const cycleSummaryEl = document.getElementById("cycleSummary");
const lowFertilityEl = document.getElementById("lowFertility");

const calendarGrid = document.getElementById("calendarGrid");
const historyBody = document.getElementById("historyBody");

const themeToggle = document.getElementById("themeToggle");
const shareButton = document.getElementById("shareButton");
const shareStatus = document.getElementById("shareStatus");

const backToTop = document.getElementById("backToTop");

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

/* --------------------------------------------------
   MAIN CALCULATION
-------------------------------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const lastPeriod = new Date(document.getElementById("lastPeriod").value);
  const cycleLength = parseInt(document.getElementById("cycleLength").value);

  if (!lastPeriod || !cycleLength) return;

  loadingSkeleton.classList.remove("hidden");
  resultsSection.classList.add("hidden");

  setTimeout(() => {
    loadingSkeleton.classList.add("hidden");

    const ovulationDay = addDays(lastPeriod, cycleLength - 14);
    const fertileStart = addDays(ovulationDay, -5);
    const fertileEnd = addDays(ovulationDay, 1);
    const nextPeriod = addDays(lastPeriod, cycleLength);

    ovulationDateEl.textContent = formatDate(ovulationDay);
    fertileWindowEl.textContent = `${formatDate(fertileStart)} – ${formatDate(fertileEnd)}`;
    nextPeriodEl.textContent = formatDate(nextPeriod);

    cycleSummaryEl.textContent =
      `Based on a ${cycleLength}-day cycle, your estimated ovulation day is ${formatDate(ovulationDay)}.`;

    /* --------------------------------------------------
       LOW FERTILITY DAYS
    -------------------------------------------------- */
    const lowBefore = `${formatDate(lastPeriod)} – ${formatDate(addDays(fertileStart, -1))}`;
    const lowAfter = `${formatDate(addDays(fertileEnd, 1))} – ${formatDate(addDays(lastPeriod, cycleLength - 1))}`;

    lowFertilityEl.textContent = `Low fertility days: ${lowBefore}, ${lowAfter}`;

    resultsSection.classList.remove("hidden");

    buildCalendar(lastPeriod, cycleLength, ovulationDay, fertileStart, fertileEnd);
    saveCycleHistory(lastPeriod, cycleLength, ovulationDay, fertileStart, fertileEnd);

  }, 800);
});

/* --------------------------------------------------
   CALENDAR GENERATION
-------------------------------------------------- */
function buildCalendar(lastPeriod, cycleLength, ovulationDay, fertileStart, fertileEnd) {
  calendarGrid.innerHTML = "";

  const days = [];
  for (let i = 0; i < cycleLength; i++) {
    days.push(addDays(lastPeriod, i));
  }

  days.forEach((day) => {
    const div = document.createElement("div");
    div.classList.add("calendar-day");
    div.textContent = day.getDate();

    const d = day.toDateString();
    const ov = ovulationDay.toDateString();

    // PERIOD (first 5 days)
    if (day >= lastPeriod && day < addDays(lastPeriod, 5)) {
      div.style.background = "var(--accent-red)";
      div.style.color = "#fff";
    }

    // FERTILE WINDOW
    if (day >= fertileStart && day <= fertileEnd) {
      div.style.background = "var(--accent-green)";
      div.style.color = "#fff";
    }

    // OVULATION
    if (d === ov) {
      div.style.background = "var(--accent-purple)";
      div.style.color = "#fff";
      div.style.fontWeight = "700";
    }

    // LOW FERTILITY (everything else)
    if (day < fertileStart || day > fertileEnd) {
      div.style.background = "var(--accent-yellow)";
      div.style.color = "#000";
    }

    calendarGrid.appendChild(div);
  });
}

/* --------------------------------------------------
   HISTORY (LOCAL STORAGE)
-------------------------------------------------- */
function saveCycleHistory(lastPeriod, cycleLength, ovulationDay, fertileStart, fertileEnd) {
  const history = JSON.parse(localStorage.getItem("cycleHistory") || "[]");

  history.unshift({
    lastPeriod: formatDate(lastPeriod),
    cycleLength,
    ovulationDay: formatDate(ovulationDay),
    fertileWindow: `${formatDate(fertileStart)} – ${formatDate(fertileEnd)}`
  });

  if (history.length > 8) history.pop();

  localStorage.setItem("cycleHistory", JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("cycleHistory") || "[]");

  historyBody.innerHTML = "";

  if (history.length === 0) {
    historyBody.innerHTML = `
      <tr><td colspan="4" class="empty">No history yet.</td></tr>`;
    return;
  }

  history.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.lastPeriod}</td>
      <td>${item.cycleLength} days</td>
      <td>${item.ovulationDay}</td>
      <td>${item.fertileWindow}</td>
    `;
    historyBody.appendChild(row);
  });
}

renderHistory();

/* --------------------------------------------------
   FAQ TOGGLE
-------------------------------------------------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

/* --------------------------------------------------
   DARK MODE
-------------------------------------------------- */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

/* --------------------------------------------------
   SHARE BUTTON
-------------------------------------------------- */
shareButton.addEventListener("click", async () => {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Ovulation Calculator",
        text: "Check your fertile window and ovulation date:",
        url
      });
      shareStatus.textContent = "Shared successfully!";
    } catch {
      shareStatus.textContent = "Share canceled.";
    }
  } else {
    navigator.clipboard.writeText(url);
    shareStatus.textContent = "Link copied to clipboard.";
  }
});

/* --------------------------------------------------
   BACK TO TOP BUTTON
-------------------------------------------------- */
/* --------------------------------------------------
   BACK TO TOP BUTTON
-------------------------------------------------- */
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});