// src/entities/Node.js

export default class Node {
  constructor({ id, lat, lng, type, status }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status;
  }

  getColor(time) {
    if (this.status === "normal") return "#00ffcc";

    if (this.status === "unstable") {
      const pulse = (Math.sin(time * 0.006) + 1) / 2;
      return `rgba(255, 170, 0, ${0.5 + pulse * 0.5})`;
    }

    // alert
    const blink = Math.sin(time * 0.012) > 0 ? 1 : 0.2;
    return `rgba(255, 51, 85, ${blink})`;
  }

  draw(ctx, map, time) {
    const point = map.latLngToContainerPoint([this.lat, this.lng]);

    const radius =
      this.type === "ctos" ? 12 :
      this.type === "camera" ? 6 :
      5;

    const color = this.getColor(time);

    ctx.save();
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = this.status === "normal" ? 8 : 16;

    ctx.fill();
    ctx.restore();
  }
}
