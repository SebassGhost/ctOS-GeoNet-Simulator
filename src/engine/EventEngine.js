export default class EventEngine {
  constructor(nodes) {
    this.nodes = nodes;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;

    if (this.timer > 5) {
      this.triggerRandomEvent();
      this.timer = 0;
    }
  }

  triggerRandomEvent() {
    const node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    node.status = node.status === "normal" ? "alert" : "normal";
  }
}
