// src/entities/Node.js
export default class Node {
  constructor({ id, lat, lng, type, status }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status;
    this.radius = 6;
  }

  isHovered(mouse, map) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    return Math.hypot(dx, dy) < this.radius + 4;
  }

  draw(ctx, map, time, hover) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);
    const pulse = Math.sin(time * 0.004) * 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, this.radius + pulse, 0, Math.PI * 2);
    ctx.fillStyle = hover ? "#ffffff" : "#00ffcc";
    ctx.shadowBlur = hover ? 20 : 10;
    ctx.shadowColor = "#00ffcc";
    ctx.fill();
    ctx.restore();
  }
}
