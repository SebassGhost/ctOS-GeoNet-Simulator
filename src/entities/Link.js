// src/entities/Link.js

export default class Link {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  draw(ctx, map, time) {
    const a = map.latLngToContainerPoint([this.from.lat, this.from.lng]);
    const b = map.latLngToContainerPoint([this.to.lat, this.to.lng]);

    const alpha = 0.3 + Math.sin(time * 0.002) * 0.2;

    ctx.save();
    ctx.strokeStyle = `rgba(0,255,204,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }
}
