// ===============================
// ctOS GeoNet Simulator – Overlay
// ===============================

import L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

// --------------------
// MAP SETUP
// --------------------
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// --------------------
// CANVAS SETUP
// --------------------
const canvas = document.getElementById("ctos-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --------------------
// NODE MODEL
// --------------------
const nodes = [];
const NODE_COUNT = 40;

const STATUS_COLORS = {
  normal: "#00ffcc",
  alert: "#ffaa00",
  compromised: "#ff3333",
  offline: "#555555"
};

function randomLatLng() {
  return [
    Math.random() * 140 - 70,
    Math.random() * 360 - 180
  ];
}

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    latlng: randomLatLng(),
    status: "normal",
    pulse: Math.random() * Math.PI * 2
  });
}

// --------------------
// HOVER DETECTION
// --------------------
let hoveredNode = null;

map.getContainer().addEventListener("mousemove", e => {
  hoveredNode = null;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (const node of nodes) {
    const point = map.latLngToContainerPoint(node.latlng);
    const dx = mx - point.x;
    const dy = my - point.y;

    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      hoveredNode = node;
      break;
    }
  }
});

// --------------------
// CLICK INTERACTION (OPTION 1)
// --------------------
map.getContainer().addEventListener("click", e => {
  if (!hoveredNode) return;

  // 🔧 REPAIR MODE (Shift + Click)
  if (e.shiftKey && hoveredNode.status === "offline") {
    hoveredNode.status = "normal";
    return;
  }

  // 🔥 HACK MODE
  switch (hoveredNode.status) {
    case "normal":
      hoveredNode.status = "alert";
      break;
    case "alert":
      hoveredNode.status = "compromised";
      break;
    case "compromised":
      hoveredNode.status = "offline";
      break;
  }
});

// --------------------
// DRAW LOOP
// --------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const node of nodes) {
    const point = map.latLngToContainerPoint(node.latlng);
    node.pulse += 0.05;

    const radius =
      node.status === "offline"
        ? 4
        : 4 + Math.sin(node.pulse) * 1.5;

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();

// --------------------
// MAP MOVE SYNC
// --------------------
map.on("move", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
