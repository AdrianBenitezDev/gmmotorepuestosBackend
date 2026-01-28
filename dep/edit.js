

let imagenes=[]
let jsonAEditar;


const h2ImagenesDiv=document.getElementById("h2ImagenesDiv");
  const imagenesDiv = document.getElementById("imagenesDiv");
  const imagenesDivScroll= document.getElementById("imagenesDivScroll");

//colocamos los change para los input
 document.getElementById("tituloP").addEventListener('keyup',(e)=>{
    document.getElementById("tituloVP").textContent=e.target.value;
 })

 
document.getElementById("stockP").addEventListener('keyup',(e)=>{
     document.getElementById("stockVP").textContent=" "+e.target.value;

 })


document.getElementById("inputPrecio").addEventListener('keyup',(e)=>{
     document.getElementById("precioVP").textContent="$ "+e.target.value;

 })


document.getElementById("descripcionP").addEventListener('keyup',(e)=>{
     document.getElementById("descripcionVP").textContent=e.target.value;
 })
     



function cargarEditProducto(categoria,id,nombre){
     
    document.getElementById("contenedorEdit").style.display="flex";

     document.getElementById("contenedorEdit").scrollIntoView();

     //cargar los datos en una variable que se itera
     //YA SE ENCUENTRA CARGADA EN JSONACTUAL
     jsonAEditar=jsonActual[id];


     //cargamos cada una de las variables
     //hay que ver que se guardara cuando se envia y como se puede editar

                //titulo del producto (CARACTERISTICAS)
                document.getElementById("tituloP").value=jsonAEditar.producto;
                document.getElementById("inputPrecio").value=parseNumeroAR(jsonAEditar.precio);
                document.getElementById("descripcionP").value=jsonAEditar.descripcion;
                
                
                document.getElementById("stockP").value=jsonAEditar.stock;
                document.getElementById("stockVP").textContent=jsonAEditar.stock;

                document.getElementById("tituloVP").textContent=jsonAEditar.producto;
                document.getElementById("precioVP").textContent="$ "+parseNumeroAR(jsonAEditar.precio);
                document.getElementById("descripcionVP").textContent=jsonAEditar.descripcion;
     

    //cargamos la url a las img
     
    for (let index = 0; index < jsonAEditar.img.length; index++) {
        
    document.getElementById("img404_"+index).src=`https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${jsonAEditar.categoria}/${jsonAEditar.id}/${jsonAEditar.img[index]}`;

        
    }
     
 
   
}

//arrayImgSeleccionadas
//creamos la variable arrayImgSeleccionadas
let arrayImgSeleccionadas=[null,null,null,null,null]
let arrayImg=[];
let nuevasRutas=[];





async function enviarProductoEditado() {
    console.log("enviando producto editado")

    //categoria
  let titulo = document.getElementById("tituloP").value;
  let precio = parseNumeroAR(document.getElementById("inputPrecio").value);
  let stockProducto= document.getElementById("stockP").value;
  let descripcion = document.getElementById("descripcionP").value;

  // VALIDACIÓN
  if (titulo == '' || precio == '' || descripcion == '' || stockProducto == '' ) {
    alert("Debe completar todos los datos");
    return;
  }else{

spinTrue();

// 6) Armar tu documento final

  // ---------------------------------------------------
  // 2) CONVERTIR IMÁGENES SELECCIONADAS A BASE64
  // ---------------------------------------------------

  //nuevasRutas

const imagenesBase64 = await Promise.all(
  arrayImgSeleccionadas.map(
    (url, index) => {
        let imagen='imagen_'+index;
        let name=jsonAEditar.id.replace("producto",imagen);
        return convertirImagenABase64(url, name)
    }
      
));



  // ---------------------------------------------------
  // 3) ARMAR PAYLOAD PARA APPS SCRIPT
  // ---------------------------------------------------


  const json = {
  
  jsonDatos:{
  categoria: jsonAEditar.categoria,
  id: jsonAEditar.id,
  producto:titulo,
  precio:precio,
  stock:stockProducto,
  descripcion:descripcion,
  img:jsonAEditar.img//los nombres de los img
    },
  images: imagenesBase64,
  type:"editar"
};


  console.log("json listo:", json);

  // ---------------------------------------------------
  // 4) ENVIAR A APPS SCRIPT
  // ---------------------------------------------------

  //para pruebas
  //let urlExcel="https://script.google.com/macros/s/AKfycbzjWcAHodsQeqmYdZfkifFIccsS5gYSjPwF1pCSmP0p/dev";
 

  //para producción
  let urlExcel="https://script.google.com/macros/s/AKfycbx-YwE7fkQKIyiQV13JPs0iIxRWw-nohtciTnR0Gb2G_ef6qtWSHSDEro_ipWeiBnTtKg/exec";
  //let urlExcel="https://sdre"
  console.log(urlExcel)

  try {
  resp = await fetch(urlExcel,{
  method: "POST", headers: {
    "Content-Type": "text/plain"  // 👈 TRUCO CLAVE: NO HAY OPTIONS
  },
  body: JSON.stringify(json)
})
 const texto = await resp.text(); // <-- aquí está la respuesta REAL
 console.log("Respuesta del backend:");
 console.log(JSON.parse(texto));

  spinFalse();
  alert("datos Actualizados correctmente")
} catch (e) {
  spinFalse();
  console.log("this error")
  console.error(e);
 
  return;
}
   }
    }

  function convertirImagenABase64(url, nombreFinal) {
    if(url){
return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: nombreFinal,   // 👈 AHORA USA EL NOMBRE REAL
            base64: reader.result.split(',')[1]
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
    }else{

    }
  
}

function limpiarUrl(){
    document.getElementById("url").value = "";
   
    document.getElementById("imagenesDivScroll").innerHTML = "";
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

  return;
}


  imagenesDivScroll.innerHTML = "";

  // ====== OBTENER TITULO ======
  let titulo = "";
  try {
    const regTitulo = /<h1[^>]*>(.*?)<\/h1>/s;
    const m = html.match(regTitulo);
    if (m) titulo = m[1].replace(/<[^>]*>/g, "").trim();
  } catch (e) {

    spinFalse()
  }

  // ====== EXTRAER IMÁGENES ======
  const regex = /https:\/\/http2\.mlstatic\.com\/[^"]+/g;
  const matches = html.match(regex) || [];

   imagenes = [...new Set(matches.filter(url =>
      url.includes("D_NQ_NP") &&
      !url.includes("2x") &&
      !url.includes("2X") &&
      !url.includes("80:") &&
      !url.endsWith(".webp")
  ))];






  if (imagenes.length === 0) {
    h2ImagenesDiv.textContent = "❌  No se encontraron imágenes.";
    spinFalse();
    return;
  }

  h2ImagenesDiv.textContent=" ✅  Imagenes cargadas Correctamente, seleccione una imagen para editar"

  spinFalse();

//   colocarListenerVP();
}









function mostrarPanelImagenes(id){


    if(imagenes.length==0){


        alert("No hay imagenes cargadas");
        
        return

    }

    imagenesDiv.style.display='flex';  
    imagenesDivScroll.innerHTML='';

  // ====== RENDERIZAR IMÁGENES ====== ❌
  imagenes.forEach((src, index) => {
    const div = document.createElement("div");
    div.setAttribute("id","imgId_"+index);
    div.className = "imgItem";

    const img = document.createElement("img");
    img.src = src;
    div.setAttribute('src',src)
    
    div.appendChild(img);
    imagenesDivScroll.appendChild(div);




    //LISTENER DE LAS IMAGENES?

    div.addEventListener("click", (e) => {

       cambiarImagenVP(id,e.target.src);


    });
  });

  //cuando terminamos de iterar
   const div = document.createElement("div");
    div.setAttribute("id","imgId_"+id);
    div.className = "imgItem";

 


   
    imagenesDivScroll.appendChild(div);



}

function salirEditImg(){
     imagenesDivScroll.innerHTML='';
       imagenesDiv.style.display="none"
}

function cambiarImagenVP(id,src){
    document.getElementById("img404_"+id).src=src;
    arrayImgSeleccionadas[id]=src
    console.log("arrayImgSeleccionadas")
    console.log(arrayImgSeleccionadas)
    salirEditImg();

}



function parseNumeroAR(valor) {
  if (typeof valor === "number") return valor;

  return Number(
    valor
      .replace(/\./g, "") // quita separador de miles
      .replace(",", ".")  // convierte decimal a formato JS
  );
}
