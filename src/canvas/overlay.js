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
   LOAD DATA
================================ */
let nodes = [];
let links = [];
let pulses = [];
const nodeMap = new Map();

async function loadData() {
  const nodeRes = await fetch("src/data/nodes.json");
  const nodeData = await nodeRes.json();

  nodes = nodeData.map(n => {
    const node = new Node(n);
    nodeMap.set(n.id, node);
    return node;
  });

  const linkRes = await fetch("src/data/links.json");
  const linkData = await linkRes.json();

  links = linkData
    .map(l => {
      const from = nodeMap.get(l.from);
      const to = nodeMap.get(l.to);
      if (!from || !to) return null;
      return new Link(from, to);
    })
    .filter(Boolean);

  // Crear pulsos (1 por link)
  pulses = links.map(link => new Pulse(link));
}

loadData();

/* ===============================
   RENDER LOOP
================================ */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  links.forEach(link => link.draw(ctx, map));

  pulses.forEach(pulse => {
    pulse.update();
    pulse.draw(ctx, map);
  });

  nodes.forEach(node => node.draw(ctx, map));

  requestAnimationFrame(render);
}

render();
