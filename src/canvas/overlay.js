// ===============================
// ctOS GeoNet Simulator – Overlay
// ===============================

// Canvas setup
const canvas = document.getElementById("ctos-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Mouse tracking
const mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// ===============================
// Simulated Nodes
// ===============================
const nodes = [
  {
    id: "CT-001",
    type: "Cámara CCTV",
    status: "ONLINE",
    x: 300,
    y: 250,
    radius: 6
  },
  {
    id: "CT-002",
    type: "Semáforo",
    status: "ONLINE",
    x: 520,
    y: 360,
    radius: 6
  },
  {
    id: "CT-003",
    type: "Router Urbano",
    status: "WARNING",
    x: 720,
    y: 220,
    radius: 6
  },
  {
    id: "CT-004",
    type: "Estación ctOS",
    status: "ONLINE",
    x: 900,
    y: 420,
    radius: 7
  }
];

// Connections (by index)
const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 2]
];

// ===============================
// Utils
// ===============================
function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function isHovered(node) {
  return distance(mouse.x, mouse.y, node.x, node.y) < node.radius + 6;
}

// ===============================
// Draw functions
// ===============================
function drawNode(node) {
  const hovered = isHovered(node);

  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

  ctx.fillStyle = hovered
    ? "rgba(0,255,204,1)"
    : "rgba(0,255,204,0.6)";

  ctx.shadowBlur = hovered ? 18 : 8;
  ctx.shadowColor = "rgba(0,255,204,0.8)";
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawLink(a, b, time) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);

  ctx.strokeStyle = "rgba(0,255,204,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Animated pulse
  const t = (time / 1000) % 1;
  const px = a.x + (b.x - a.x) * t;
  const py = a.y + (b.y - a.y) * t;

  ctx.beginPath();
  ctx.arc(px, py, 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,255,204,0.9)";
  ctx.fill();
}

function drawHUD(node) {
  const padding = 10;
  const width = 200;
  const height = 70;

  const x = node.x + 14;
  const y = node.y - height / 2;

  ctx.fillStyle = "rgba(5,15,20,0.85)";
  ctx.strokeStyle = "rgba(0,255,204,0.8)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(0,255,204,0.9)";
  ctx.font = "12px monospace";

  ctx.fillText(`ID: ${node.id}`, x + padding, y + 18);
  ctx.fillText(`TYPE: ${node.type}`, x + padding, y + 34);
  ctx.fillText(`STATUS: ${node.status}`, x + padding, y + 50);
}

// ===============================
// Animation Loop
// ===============================
function animate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw links
  links.forEach(([a, b]) => {
    drawLink(nodes[a], nodes[b], time);
  });

  // Draw nodes
  nodes.forEach(node => drawNode(node));

  // Draw HUD if hovered
  nodes.forEach(node => {
    if (isHovered(node)) {
      drawHUD(node);
    }
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
