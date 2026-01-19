// src/entities/Pulse.js

export default class Pulse {
  constructor(link) {
    this.link = link;
    this.progress = Math.random();
    this.speed = 0.003 + Math.random() * 0.003;
  }

  update() {
    this.progress += this.speed;

    if (this.progress > 1) {
      this.progress = 0;
    }
  }

  draw(ctx, map) {
    const from = map.latLngToContainerPoint([
      this.link.from.lat,
      this.link.from.lng
    ]);
    const to = map.latLngToContainerPoint([
      this.link.to.lat,
      this.link.to.lng
    ]);

    const x = from.x + (to.x - from.x) * this.progress;
    const y = from.y + (to.y - from.y) * this.progress;

    ctx.save();
    ctx.fillStyle = "#00ffcc";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";

    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

