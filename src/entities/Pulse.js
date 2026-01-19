// src/entities/Pulse.js

export default class Pulse {
  constructor(link, speed = 0.002) {
    this.link = link;
    this.progress = Math.random(); // para que no todos salgan a la vez
    this.speed = speed;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) this.progress = 0;
  }

  draw(ctx, map) {
    const p1 = map.latLngToContainerPoint([
      this.link.from.lat,
      this.link.from.lng
    ]);

    const p2 = map.latLngToContainerPoint([
      this.link.to.lat,
      this.link.to.lng
    ]);

    const x = p1.x + (p2.x - p1.x) * this.progress;
    const y = p1.y + (p2.y - p1.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc";
    ctx.fill();
  }
}

