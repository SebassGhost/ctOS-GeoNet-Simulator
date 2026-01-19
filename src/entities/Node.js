// src/entities/Node.js

export default class Node {
  constructor({ id, lat, lng, type, status }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status || "normal";
    this.radius = 6;
  }

  /* ===============================
     STATUS → COLOR
  ================================ */
  getColor() {
    switch (this.status) {
      case "alert":
        return "#ffaa00"; // amarillo
      case "compromised":
        return "#ff0033"; // rojo
      case "offline":
        return "#555555"; // gris
      default:
        return "#00ffcc"; // normal
    }
  }

  getGlow() {
    switch (this.status) {
      case "alert":
        return 16;
      case "compromised":
        return 24;
      case "offline":
        return 0;
      default:
        return 12;
    }
  }

  isHovered(mouse, map) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    return Math.hypot(dx, dy) < this.radius + 6;
  }

  draw(ctx, map, time, hover) {
    const p = map.latLngToContainerPoint([this.lat, this.lng]);

    const pulse =
      this.status !== "offline"
        ? Math.sin(time * 0.004) * 2
        : 0;

    const color = hover ? "#ffffff" : this.getColor();

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, this.radius + pulse, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = hover ? 28 : this.getGlow();
    ctx.shadowColor = this.getColor();
    ctx.fill();
    ctx.restore();
  }
}

