import {categoriasTextos} from "../config.js"


let arrayImgSeleccionadas = [];
const btn = document.getElementById("btnCP");

window.name = "ML_IMGS";
document.getElementById("btnML").addEventListener('click',()=>{
  window.open("https://www.mercadolibre.com.ar/", "ML_PAGE");

})
window.addEventListener("message", (event) => {

  // Seguridad básica
  if (!event.data || event.data.origen !== "ML_BOOKMARKLET") return;

  const imagenes = event.data.imagenes;
  if (!Array.isArray(imagenes)) return;

  console.log("📥 Imágenes recibidas:", imagenes);

  procesarImagenesDesdeML(imagenes);

  let resp=confirm("Desea utilizar el nombre del producto optenido?\n "+event.data.nombre)
  if(resp){
  //colocamos el nombre del producto
  document.getElementById("tituloP").value = event.data.nombre
  document.getElementById("tituloVP").textContent =event.data.nombre

  }
});




export function colocarOptions(){
  let eleCategoria=document.getElementById("categorias");

categoriasTextos.forEach((e,index)=>{
  eleCategoria.innerHTML+=`<option ${index==0?"selected":''} value="${e}">${e.toUpperCase()}</option>`
})
 

}


colocarOptions()

//luego elimnar
document.getElementById("descripcionP").value = "Agregue una descripción del producto";


const iconoCheck = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M5 13l4 4L19 7" stroke="#0f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;





export function procesarImagenesDesdeML(imagenes) {
  spinTrue();

  const filtradas = imagenes.filter(src =>
    src.includes("-O.") ||
    src.includes("-OO.") ||
    src.endsWith(".jpg")
  );

  if (filtradas.length === 0) {
    spinFalse();
    return alert("No hay imágenes válidas");
  }

  console.log("imagenes filtradas")
  console.log(filtradas)
  setImgOptenidasML(filtradas)
  try{
  let h3Aviso= document.getElementById("h3AvisoImgDisponibles").textContent;
  if(imagenesML.length>0){
    h3Aviso="✅ Hay Imagenes Disponibles"
  }else{

    h3Aviso="❌ No Hay Imagenes Disponibles"
  }
  }catch(err){

  }
  
  try{ 
  renderizarImagenes(filtradas); 
  }catch(error){

  }

  spinFalse();
}
export let imagenesML=[];
export function setImgOptenidasML (img){
imagenesML=img;
}

export function renderizarImagenes(imagenes) {
  const imagenesDiv = document.getElementById("imagenesDiv");
  imagenesDiv.innerHTML = "";
  arrayImgSeleccionadas.length = 0;

  imagenes.forEach((src, index) => {
    const div = document.createElement("div");
    div.id = "imgId_" + index;
    div.className = "imgItem";

    const img = document.createElement("img");
    img.src = src;

    div.appendChild(img);
    imagenesDiv.appendChild(div);

    div.addEventListener("click", () => {
      const idx = arrayImgSeleccionadas.indexOf(src);

      if (idx > -1) {
        arrayImgSeleccionadas.splice(idx, 1);
        if (div.lastChild !== img) div.removeChild(div.lastChild);
      } else {
        const divCheck = document.createElement("div");
        divCheck.innerHTML = iconoCheck;
        div.appendChild(divCheck);
        arrayImgSeleccionadas.push(src);
      }

      colocarImgVP();
    });
  });
}

// ====== MOSTRAR IMÁGENES EN PREVIEW ======
export function colocarImgVP(){
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
