let routes = [
  {
    id: 1,
    name: "Route 1",
    color: "#ef4444",
    totalDishes: 45,
    prepMinutes: 25,
    departureTime: "10:00",
    returnTime: "11:30",
    drops: "1a (15), 1b (10), 1c (20)",
    status: "Pending"
  },
  {
    id: 2,
    name: "Route 3",
    color: "#eab308",
    totalDishes: 30,
    prepMinutes: 20,
    departureTime: "10:45",
    returnTime: "12:00",
    drops: "3a, 3b, 3c, 3d, 3e",
    status: "Pending"
  }
];

// Helper: Calculate Assembly Start Time by subtracting prep minutes from departure time
function calculateStartTime(departureTimeStr, prepMinutes) {
  const [hours, minutes] = departureTimeStr.split(":").map(Number);
  const depDate = new Date();
  depDate.setHours(hours, minutes, 0, 0);

  const startDate = new Date(depDate.getTime() - prepMinutes * 60000);
  return startDate.toTimeString().substring(0, 5);
}

// Render schedule ordered by Assembly Start Time
function renderSchedule() {
  const container = document.getElementById("schedule-list");
  container.innerHTML = "";

  // Sort routes by Assembly Start Time
  const sortedRoutes = [...routes].sort((a, b) => {
    const startA = calculateStartTime(a.departureTime, a.prepMinutes);
    const startB = calculateStartTime(b.departureTime, b.prepMinutes);
    return startA.localeCompare(startB);
  });

  sortedRoutes.forEach((route) => {
    const startTime = calculateStartTime(route.departureTime, route.prepMinutes);

    const card = document.createElement("div");
    card.className = "route-card";
    card.style.borderLeftColor = route.color;

    card.innerHTML = `
      <div class="route-header">
        <span class="route-title" style="color: ${route.color}">${route.name}</span>
        <span class="time-badge">Pack Start: <strong>${startTime}</strong></span>
      </div>
      <div class="route-details">
        <div><strong>Dishes:</strong> ${route.totalDishes}</div>
        <div><strong>Boxing Time:</strong> ${route.prepMinutes} mins</div>
        <div><strong>Must Leave:</strong> ${route.departureTime}</div>
        <div><strong>Driver Returns:</strong> ${route.returnTime}</div>
      </div>
      <div class="drop-list">
        <strong>Drops Breakdown:</strong> ${route.drops}
      </div>
      <button class="status-btn ${route.status === "Ready" ? "ready" : ""}" onclick="toggleStatus(${route.id})">
        Status: ${route.status}
      </button>
    `;

    container.appendChild(card);
  });
}

// Toggle route packing status
function toggleStatus(id) {
  routes = routes.map((r) => {
    if (r.id === id) {
      return { ...r, status: r.status === "Pending" ? "Ready" : "Pending" };
    }
    return r;
  });
  renderSchedule();
}

// Handle Form Submission
document.getElementById("route-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const newRoute = {
    id: Date.now(),
    name: document.getElementById("routeNumber").value,
    color: document.getElementById("colorCode").value,
    totalDishes: parseInt(document.getElementById("totalDishes").value),
    prepMinutes: parseInt(document.getElementById("prepMinutes").value),
    departureTime: document.getElementById("departureTime").value,
    returnTime: document.getElementById("returnTime").value,
    drops: document.getElementById("drops").value,
    status: "Pending"
  };

  routes.push(newRoute);
  renderSchedule();
  this.reset();
});

// Initial Render
renderSchedule();
