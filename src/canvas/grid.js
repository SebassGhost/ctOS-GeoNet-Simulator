const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let offset = 0;

function drawGrid(time = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = 80;
  offset = (time * 0.005) % spacing;

  ctx.save();
  ctx.strokeStyle = "rgba(0, 255, 204, 0.06)";
  ctx.lineWidth = 1;

  // vertical lines
  for (let x = -spacing; x < canvas.width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + offset, canvas.height);
    ctx.stroke();
  }

  // horizontal lines
  for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(canvas.width, y + offset);
    ctx.stroke();
  }

  ctx.restore();
  requestAnimationFrame(drawGrid);
}

drawGrid();
