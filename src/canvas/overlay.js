// src/canvas/overlay.js

const canvas = document.getElementById("ctos-canvas");
const ctx = canvas.getContext("2d");

/* ===============================
   CANVAS SIZE
================================ */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ===============================
   COORDINATE CONVERSION
================================ */
function latLngToCanvas(lat, lng) {
  const point = map.latLngToContainerPoint([lat, lng]);
  return { x: point.x, y: point.y };
}

/* ===============================
   TEST NODE (TEMPORAL)
================================ */
const testNode = {
  lat: 40.7128,
  lng: -74.0060
};

function drawTestNode() {
  const pos = latLngToCanvas(testNode.lat, testNode.lng);

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffcc";
  ctx.fill();
}

/* ===============================
   RENDER LOOP
================================ */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTestNode();

  requestAnimationFrame(render);
}

render();

/* ===============================
   MAP EVENTS SYNC
================================ */
map.on("move", () => {});
map.on("zoom", () => {});

