const codigo = `
(() => {
  try {
    // 🖼️ EXTRAER IMÁGENES
    const imagenes = [...document.querySelectorAll("img")]
      .map(img => img.src)
      .filter(src =>
        src &&
        src.includes("mlstatic") &&
        !src.includes("avatar") &&
        !src.includes("logo") &&
        !src.includes("frontend-assets")
      );

    const unicas = [...new Set(imagenes)];

    if (!unicas.length) {
      alert("❌ No se encontraron imágenes");
      return;
    }

    // 🏷️ EXTRAER NOMBRE DESDE METADATA
    let nombre = "";

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle?.content) nombre = ogTitle.content.trim();

    if (!nombre) {
      const metaTitle = document.querySelector('meta[name="title"]');
      if (metaTitle?.content) nombre = metaTitle.content.trim();
    }

    if (!nombre) nombre = document.title || "Producto sin nombre";

    // 📦 PAYLOAD
    const payload = {
      origen: "ML_BOOKMARKLET",
      nombre,
      imagenes: unicas
    };

    const TARGET_ORIGIN = "https://admin.gmmotorepuestos.com.ar";
    const TARGET_URL = TARGET_ORIGIN + "/cp/cp.html";
    const WINDOW_NAME = "ML_CP_WEB";

    // 🧠 CASO 1: la web abrió MercadoLibre
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(payload, TARGET_ORIGIN);
      alert(\`📤 \${unicas.length} imágenes enviadas\\n📦 \${nombre}\`);
      return;
    }

    // 🧠 CASO 2: la web NO estaba abierta → abrirla o reutilizarla
    const win = window.open(TARGET_URL, WINDOW_NAME);

    if (!win) {
      alert("❌ El navegador bloqueó la ventana");
      return;
    }

    // ⏳ Esperar a que la web cargue y enviar
    const interval = setInterval(() => {
      if (win.closed) {
        clearInterval(interval);
        alert("❌ La ventana se cerró");
        return;
      }

      try {
        win.postMessage(payload, TARGET_ORIGIN);
        clearInterval(interval);
        alert(\`📤 \${unicas.length} imágenes enviadas\\n📦 \${nombre}\`);
      } catch (e) {
        // sigue intentando hasta que cargue
      }
    }, 500);

  } catch (e) {
    alert("❌ Error ejecutando bookmarklet");
    console.error(e);
  }
})();
`;

document.getElementById("bm").href =
  "javascript:" + encodeURIComponent(codigo);
