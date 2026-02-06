const canvas = document.getElementById("flyerCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1080;
const HEIGHT = 1920;

export async function crearFlyer(producto) {

  const logo = document.getElementById("logoWrapper");
const canvasLogo = await html2canvas(logo, { backgroundColor: null });


  // Fondo
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

//-------------------- LOGO ----------------------

//coloco el logo en el flyer
const logoMaxWidth = 1800; // 👈 más grande
const scale = logoMaxWidth / canvasLogo.width;

const logoWidth = canvasLogo.width * scale;
const logoHeight = canvasLogo.height * scale;

// centrado horizontal
const x = (WIDTH - logoWidth) / 2;
const y = 60; // margen superior

ctx.drawImage(
  canvasLogo,
  x,
  y,
  logoWidth,
  logoHeight
);
//---------------fin del logo-----------------

// Precio
  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("GM MotoRepuestos", WIDTH / 4, 350);


  // Imagen producto (CORS OK)
  const img = new Image();
  img.crossOrigin = "anonymous"; // IMPORTANTE
  img.src = producto.img[0];


  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  drawRoundedImage(
  ctx,
  img,
  140,
  500,
  800,
  800,
  40 // radio de borde
);



  //Nombre
  ctx.fillStyle = "#ffffff";
ctx.font = "bold 58px Arial";
ctx.textAlign = "center";

drawMultilineText(
  ctx,
  producto.producto,
  WIDTH / 2,
  1480,
  900,   // ancho máximo
  70     // altura entre líneas
);


  // Precio
  ctx.font = "bold 90px Arial";
  ctx.fillStyle = "#00e676";
  ctx.fillText(`$${producto.precio}`, WIDTH / 2, 1720);

  // Footer
  ctx.font = "36px Arial";
  ctx.fillStyle = "#3100b9";
  ctx.fillText("GMmotorepuestos.com.ar", WIDTH / 2, 1850);

  //no descarga directo
  const url = canvas.toDataURL("image/png");

const preview = document.getElementById("previewFlyer");
preview.src = url;
preview.style.display = "block";

// guardar para descargar después
window.flyerURL = url;

}


  // Exportar
document.getElementById("descargarFlyer").onclick = () => {
  const link = document.createElement("a");
  link.href = window.flyerURL;
  link.download = "flyer.png";
  link.click();
};


function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  lines.forEach((l, i) => {
    ctx.fillText(l.trim(), x, y + i * lineHeight);
  });
}


function drawRoundedImage(ctx, img, x, y, w, h, r) {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.clip(); // 👈 recorte

  ctx.drawImage(img, x, y, w, h);

  ctx.restore();
}
