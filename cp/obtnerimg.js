const btn = document.getElementById("btnCP");

//luego elimnar
document.getElementById("descripcionP").value = "eliminar para la versión de producción";


const iconoCheck = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M5 13l4 4L19 7" stroke="#0f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const categoriasTextos = [
  "Seleccione una categoria",
  "motor",
  "transmision",
  "frenos",
  "electricidad e iluminación",
  "suspension",
  "cubiertas y llantas",
  "escapes",
  "carroceria y plasticos",
  "accesorios",
  "mantenimiento"
];

let eleCategoria=document.getElementById("categorias");

categoriasTextos.forEach((e,index)=>{
  eleCategoria.innerHTML+=`<option ${index==2?"selected":''} value="${e}">${e.toUpperCase()}</option>`
})
 

let arrayImgSeleccionadas = [];

function limpiarUrl(){
    document.getElementById("url").value = "";
   
    document.getElementById("imagenesDiv").innerHTML = "";
}

async function pegarUrl() {
  try {
    const texto = await navigator.clipboard.readText();
    console.log("Pegado:", texto);
    document.getElementById("url").value = texto;
  } catch (error) {
    console.error("Error al pegar:", error);
  }
}

async function extraer() {
  spinTrue();
  const entrada = document.getElementById("url").value.trim();
  if (!entrada) {
    spinFalse();
    return alert("Pegá la URL del producto");
  }
  


  // FETCH




//el proxi que usamos es el de producción
const proxy =
  "https://script.google.com/macros/s/AKfycbx-YwE7fkQKIyiQV13JPs0iIxRWw-nohtciTnR0Gb2G_ef6qtWSHSDEro_ipWeiBnTtKg/exec?url=" +
  encodeURIComponent(entrada);

let html;
try {
  html = await fetch(proxy).then(r => r.text());
} catch (e) {
  spinFalse();
  console.error(e);
  alert("No se pudo obtener la página. Revisa la consola.");
  btn.disabled = true;
  btn.className = "btnDisabled";
  return;
}




  const imagenesDiv = document.getElementById("imagenesDiv");
  imagenesDiv.innerHTML = "";

  // ====== OBTENER TITULO ======
  let titulo = "";
  try {
    const regTitulo = /<h1[^>]*>(.*?)<\/h1>/s;
    const m = html.match(regTitulo);
    if (m) titulo = m[1].replace(/<[^>]*>/g, "").trim();
  } catch (e) {

    spinFalse()
  }

  // ====== MOSTRAR DATOS ======
  const datos = document.createElement("div");
  document.getElementById("tituloVP").textContent = titulo;
  document.getElementById("tituloP").value=titulo;

  
  

  // ====== EXTRAER IMÁGENES ======
  const regex = /https:\/\/http2\.mlstatic\.com\/[^"]+/g;
  const matches = html.match(regex) || [];

  const imagenes = [...new Set(matches.filter(url =>
      url.includes("D_NQ_NP") &&
      !url.includes("2x") &&
      !url.includes("2X") &&
      !url.includes("80:") &&
      !url.endsWith(".webp")
  ))];

  if (imagenes.length === 0) {
    imagenesDiv.textContent = "No se encontraron imágenes.";
    spinFalse();
    btn.className = "btnDisabled";
    btn.disabled = true;
    return;
  }

  spinFalse();
  btn.className = "btnEnabled";
  btn.disabled = false;

  // ====== RENDERIZAR IMÁGENES ======
  imagenes.forEach((src, index) => {
    const div = document.createElement("div");
    div.setAttribute("id","imgId_"+index);
    div.className = "imgItem";

    const img = document.createElement("img");
    img.src = src;
    div.appendChild(img);
    imagenesDiv.appendChild(div);

    div.addEventListener("click", () => {

      const idx = arrayImgSeleccionadas.indexOf(src);

      if (idx > -1) {
        arrayImgSeleccionadas.splice(idx, 1);
        if(div.lastChild !== img) div.removeChild(div.lastChild);

      } else {
        
        const divCheck = document.createElement("div");
        divCheck.style.display = "flex";
        divCheck.style.alignItems = "center";
        divCheck.id="idCheck_"+idx;
        divCheck.innerHTML = iconoCheck;
        div.appendChild(divCheck);
        arrayImgSeleccionadas.push(src);
      }
      colocarImgVP();
      console.log(arrayImgSeleccionadas);
    });
  });

  colocarListenerVP();
}

// ====== MOSTRAR IMÁGENES EN PREVIEW ======
function colocarImgVP(){
  for(let i=0; i<=4; i++){
    const imgVP = document.getElementById("img404_"+i);
    if(imgVP){
      imgVP.src = arrayImgSeleccionadas[i] || "../Image404.png";
    }
  }
}

// ====== SPINNER ======
function spinFalse() {
  document.getElementById('overlay').style.display = "none";
}
function spinTrue() {
  document.getElementById('overlay').style.display = "flex";
}

// ====== LISTENERS INPUTS ======
function colocarListenerVP(){
  const inputPrecio = document.getElementById("inputPrecio");
  if(inputPrecio) inputPrecio.onkeyup = () => document.getElementById("precioVP").textContent = inputPrecio.value;

  const tituloP = document.getElementById("tituloP");
  if(tituloP) tituloP.onkeyup = () => document.getElementById("tituloVP").textContent = tituloP.value;

  const descripcionP = document.getElementById("descripcionP");
  if(descripcionP) descripcionP.onkeyup = () => document.getElementById("descripcionVP").textContent = descripcionP.value;
}




// Agregar listener a las image404

for (let index = 0; index < 5; index++) {
 
  document.getElementById("img404_"+index).addEventListener("click",()=>{

    try {
        
         
          Array.from(document.getElementsByClassName("imgItem")).forEach(divImg => {

            const img=divImg.firstElementChild
            const last = divImg.lastElementChild; // último hijo que sea un elemento real

            if (last && img.src == arrayImgSeleccionadas[index]) {
              divImg.removeChild(last);
            }


          });

            arrayImgSeleccionadas.splice(index,1)


          colocarImgVP();
    } catch (error) {
      console.error(error)
    }


  })
  
}