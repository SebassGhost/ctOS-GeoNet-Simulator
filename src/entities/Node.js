export default class Node {
  constructor({ id, lat, lng, type = "device", status = "normal" }) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.type = type;
    this.status = status;
  }

  draw(ctx, map) {
    const pos = map.latLngToContainerPoint([this.lat, this.lng]);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.type === "ctos" ? 12 : 5, 0, Math.PI * 2);

    ctx.fillStyle =
      this.status === "normal" ? "#00ffcc" :
      this.status === "unstable" ? "#ffaa00" :
      "#ff3355";

    ctx.fill();
  }
}
