// src/entities/Link.js

export default class Link {
  constructor(fromNode, toNode) {
    this.from = fromNode;
    this.to = toNode;
  }

  draw(ctx, map) {
    const p1 = map.latLngToContainerPoint([this.from.lat, this.from.lng]);
    const p2 = map.latLngToContainerPoint([this.to.lat, this.to.lng]);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.strokeStyle = "rgba(0, 255, 204, 0.35)";
    ctx.lineWidth = 1;

    ctx.stroke();
  }
}

