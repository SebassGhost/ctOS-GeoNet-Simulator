// src/entities/Node.js

export default class Node {
  constructor({ id, lat, lng, type, status }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status;
  }

  getRadius() {
    return this.type === "ctos" ? 12 : this.type === "camera" ? 6 : 5;
  }

  getColor(time) {
    if (this.status === "normal") return "#00ffcc";

    if (this.status === "unstable") {
      const pulse = (Math.sin(time * 0.006) + 1) / 2;
      return `rgba(255, 170, 0, ${0.5 + pulse * 0.5})`;
    }

    const blink = Math.sin(time * 0.012) > 0 ? 1 : 0.2;
    return `rgba(255, 51, 85, ${blink})`;
  }

  isHovered(mouse, map) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.getRadius() + 4;
  }

  draw(ctx, map, time, hovered = false) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);
    const radius = this.getRadius();
    const color = this.getColor(time);

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = hovered ? 22 : 12;

    ctx.fill();
    ctx.restore();
  }
}
