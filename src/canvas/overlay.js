// src/canvas/overlay.js

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
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ===============================
   DATA
================================ */
let nodes = [];
let links = [];
let pulses = [];
let hoveredNode = null;
const nodeMap = new Map();

async function loadData() {
  const nodeData = await (await fetch("src/data/nodes.json")).json();
  nodes = nodeData.map(n => {
    const node = new Node(n);
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
   HUD DRAW
================================ */
function drawHackPanel(ctx, node, x, y) {
  const w = 180;
  const h = 90;

  ctx.save();
  ctx.fillStyle = "rgba(10, 20, 25, 0.85)";
  ctx.strokeStyle = "#00ffcc";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.rect(x + 14, y - h / 2, w, h);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#00ffcc";
  ctx.font = "12px monospace";
  ctx.fillText(`ID: ${node.id}`, x + 22, y - 20);
  ctx.fillText(`TYPE: ${node.type}`, x + 22, y - 4);
  ctx.fillText(`STATUS: ${node.status}`, x + 22, y + 12);

  ctx.restore();
}

/* ===============================
   RENDER LOOP
================================ */
function render(time = performance.now()) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hoveredNode = null;

  links.forEach(link => link.draw(ctx, map, time));

  pulses.forEach(p => {
    p.update();
    p.draw(ctx, map);
  });

  nodes.forEach(node => {
    const isHover = node.isHovered(mouse, map);
    if (isHover) hoveredNode = node;
    node.draw(ctx, map, time, isHover);
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

render();
