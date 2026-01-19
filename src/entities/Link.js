// src/entities/Link.js

export default class Link {
  constructor(fromNode, toNode) {
    this.from = fromNode;
    this.to = toNode;
  }

  getAlpha(time) {
    if (this.from.status === "alert" || this.to.status === "alert") {
      return Math.sin(time * 0.01) > 0 ? 0.9 : 0.2;
    }

    if (this.from.status === "unstable" || this.to.status === "unstable") {
      return 0.6;
    }

    return 0.25;
  }

  draw(ctx, map, time) {
    const p1 = map.latLngToContainerPoint([this.from.lat, this.from.lng]);
    const p2 = map.latLngToContainerPoint([this.to.lat, this.to.lng]);

    const alpha = this.getAlpha(time);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.strokeStyle = `rgba(0, 255, 204, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = "rgba(0, 255, 204, 0.5)";
    ctx.shadowBlur = alpha > 0.5 ? 10 : 4;

    ctx.stroke();
    ctx.restore();
  }
}
