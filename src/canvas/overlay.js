// src/canvas/overlay.js

import Node from "../entities/Node.js";

/* ===============================
   MAP SETUP
================================ */
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([40.7128, -74.0060], 11);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 19 }
).addTo(map);

/* ===============================
   CANVAS SETUP
================================ */
const canvas = document.getElementById("ctos-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ===============================
   ENTITIES
================================ */
const ctosNode = new Node({
  id: "ctos-core",
  lat: 40.7128,
  lng: -74.0060,
  type: "ctos",
  status: "normal"
});

/* ===============================
   RENDER LOOP
================================ */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctosNode.draw(ctx, map);

  requestAnimationFrame(render);
}

render();
