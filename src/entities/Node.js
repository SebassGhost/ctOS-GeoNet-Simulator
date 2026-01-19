// src/entities/Node.js

export default class Node {
  constructor({ id, lat, lng, type = "device", status = "normal" }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status;
  }

  draw(ctx, map) {
    const point = map.latLngToContainerPoint([this.lat, this.lng]);

    const radius = this.type === "ctos" ? 12 : 5;

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

    ctx.fillStyle =
      this.status === "normal" ? "#00ffcc" :
      this.status === "unstable" ? "#ffaa00" :
      "#ff3355";

    ctx.fill();
  }
}
