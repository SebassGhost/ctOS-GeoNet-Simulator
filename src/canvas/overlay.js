// ===============================
// ctOS GeoNet Simulator – Overlay
// ===============================

import Node from "../entities/Node.js";
import Link from "../entities/Link.js";
import Pulse from "../entities/Pulse.js";

/* ===============================
   MAP SETUP
================================ */
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([40.7128, -74.0060], 12);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 19 }
).addTo(map);

/* ===============================
   CANVAS
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
   MOUSE
================================ */
const mouse = { x: 0, y: 0 };

map.getContainer().addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

/* ===============================
   DATA
================================ */
let nodes = [];
let links = [];
let pulses = [];
let hoveredNode = null;

const nodeMap = new Map();

/* ===============================
   LOAD DATA
================================ */
async function loadData() {
  const nodeData = await (await fetch("src/data/nodes.json")).json();

  nodes = nodeData.map(n => {
    const node = new Node({
      ...n,
      status: n.status || "normal"
    });
    nodeMap.set(n.id, node);
    return node;
  });

  const linkData = await (await fetch("src/data/links.json")).json();

  links = linkData
    .map(l => {
      const from = nodeMap.get(l.from);
      const to = nodeMap.get(l.to);
      return from && to ? new Link(from, to) : null;
    })
    .filter(Boolean);

  pulses = links.map(link => new Pulse(link));
}
loadData();

/* ===============================
   CLICK → MANUAL HACK
================================ */
map.getContainer().addEventListener("click", () => {
  if (!hoveredNode) return;

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
    case "offline":
      // se queda offline
      break;
  }
});

/* ===============================
   VERY RARE EVENTS (OPTIONAL)
================================ */
let rareEventTimer = 0;

function updateRareEvents(dt) {
  rareEventTimer += dt;

  // evento MUY raro (cada ~60s)
  if (rareEventTimer > 60 && nodes.length > 0) {
    const node = nodes[Math.floor(Math.random() * nodes.length)];

    if (node.status === "normal") {
      node.status = "alert";
    }

    rareEventTimer = 0;
  }
}

/* ===============================
   HUD
================================ */
function drawHackPanel(ctx, node, x, y) {
  const w = 200;
  const h = 110;

  ctx.save();
  ctx.fillStyle = "rgba(8,16,20,0.9)";
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.rect(x + 18, y - h / 2, w, h);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#00ffcc";
  ctx.font = "12px monospace";
  ctx.fillText(`ID: ${node.id}`, x + 28, y - 26);
  ctx.fillText(`TYPE: ${node.type}`, x + 28, y - 10);
  ctx.fillText(`STATUS: ${node.status}`, x + 28, y + 6);
  ctx.fillText(`ACTION: CLICK TO HACK`, x + 28, y + 26);

  ctx.restore();
}

/* ===============================
   RENDER LOOP
================================ */
let lastTime = 0;

function render(time) {
  const dt = (time - lastTime) * 0.001;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hoveredNode = null;

  updateRareEvents(dt);

  links.forEach(link => link.draw(ctx, map, time));

  pulses.forEach(p => {
    p.update(dt);
    p.draw(ctx, map);
  });

  nodes.forEach(node => {
    const hover = node.isHovered(mouse, map);
    if (hover) hoveredNode = node;
    node.draw(ctx, map, time, hover);
  });

  if (hoveredNode) {
    const p = map.latLngToContainerPoint([
      hoveredNode.lat,
      hoveredNode.lng
    ]);
    drawHackPanel(ctx, hoveredNode, p.x, p.y);
  }

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
