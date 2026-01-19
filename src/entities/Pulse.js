// src/entities/Pulse.js

export default class Pulse {
  constructor(link) {
    this.link = link;
    this.t = Math.random();
    this.speed = 0.4 + Math.random() * 0.4;
  }

  update(dt) {
    this.t += dt * this.speed;
    if (this.t > 1) this.t = 0;
  }

  draw(ctx, map) {
    const a = map.latLngToContainerPoint([this.link.from.lat, this.link.from.lng]);
    const b = map.latLngToContainerPoint([this.link.to.lat, this.link.to.lng]);

    const x = a.x + (b.x - a.x) * this.t;
    const y = a.y + (b.y - a.y) * this.t;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";
    ctx.fill();
    ctx.restore();
  }
}
