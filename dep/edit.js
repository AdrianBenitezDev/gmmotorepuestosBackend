import { setValorJsonActual, jsonActual } from "../config.js";
import { categoriasTextos } from "../config.js";
import {generarKeywords} from "../busquedaPalabra.js"
import {procesarImagenesDesdeML,imagenesML,setImgOptenidasML} from "../cp/obtnerimg.js"
import { spiner } from "../spin.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const auth = getAuth();

let jsonAEditar;


const h2ImagenesDiv=document.getElementById("h2ImagenesDiv");
  const imagenesDivML = document.getElementById("imagenesDivML");
  const imagenesDivScroll= document.getElementById("imagenesDivScroll");
   const divContenedorEditar=document.getElementById("divContenedorEditar")

   //DECLARAMOS EL ARRAY PARA ENVIAR AL BACKEND
   //CONTENDRA LAS URL DE LAS IMAGENES PARA CONVERTIR EN BASE 64
   let newArrayEditImg=[null,null,null,null,null]

//LISTENER DEL BTN SALIR EDITAR IMAGEN
document.getElementById("salirEditImg").addEventListener('click',()=>{
     divContenedorEditar.style.display="none";
     imagenesDivML.innerHTML='';

})

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
     



export function cargarEditProducto(idProducto){
     
    document.getElementById("contenedorEdit").style.display="flex";

     document.getElementById("contenedorEdit").scrollIntoView();

     //cargar los datos en una variable que se itera
     //YA SE ENCUENTRA CARGADA EN JSONACTUAL
     console.log(idProducto)
     jsonAEditar=jsonActual.find(ele=>ele.id==idProducto);
     console.log(jsonAEditar)


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

                 let categoriasEditada=document.getElementById("categoriasEditada");
                
                 let categoriaActual=jsonAEditar.categoria.toLowerCase();
                 //cargar 
                categoriasTextos.forEach((e)=>{

                          if(categoriaActual==e.toLowerCase()){
                          
                        categoriasEditada.innerHTML+=`<option selected value="${e.toLowerCase}">${e.toUpperCase()}</option>`

                          }else{
                        categoriasEditada.innerHTML+=`<option value="${e}">${e.toLowerCase()}</option>`
                          }

                })
     

    //cargamos la url a las img
     
    for (let index = 0; index < jsonAEditar.img.length; index++) {
        
    document.getElementById("img404_"+index).src=`${jsonAEditar.img[index]}`;

        
    }
     
 
   //colocamos el listener del boton para enviar el producto editado
   document.getElementById("btnEP").addEventListener('click',enviarProductoEditado)
}

//arrayImgSeleccionadas
//creamos la variable arrayImgSeleccionadas
//let arrayImgSeleccionadas=[null,null,null,null,null]
let arrayImg=[];
let nuevasRutas=[];





async function enviarProductoEditado() {

    //categoria
  let titulo = document.getElementById("tituloP").value;
  let precio = parseNumeroAR(document.getElementById("inputPrecio").value);
  let stockProducto= document.getElementById("stockP").value;
  let descripcion = document.getElementById("descripcionP").value;
  let valorCategoriaEditada = document.getElementById("categoriasEditada").value

  // VALIDACIÓN
  if (titulo == '' || precio == '' || descripcion == '' || stockProducto == ''|| valorCategoriaEditada.toUpperCase() == "SELECCIONE UNA CATEGORIA" ) {
    alert("Debe completar todos los datos");
    return;
  }else{

spiner(true);

// 6) Armar tu documento final

  // ---------------------------------------------------
  // 2) CONVERTIR IMÁGENES SELECCIONADAS A BASE64
  // ---------------------------------------------------

  //nuevasRutas

const imagenesBase64Editadas = await Promise.all(
  newArrayEditImg.map(
    (url, index) => {
    if(url==null) return null;

        let imagen='imagen_'+index;
        let name=jsonAEditar.id.replace("producto",imagen);
        return convertirImagenABase64(url, name)
    }
      
));



  // ---------------------------------------------------
  // 3) ARMAR PAYLOAD PARA APPS SCRIPT
  // ---------------------------------------------------


  const json = {
  
  categoria: valorCategoriaEditada.toLowerCase(),
  id: jsonAEditar.id,
  producto:titulo,
  producto_lower:titulo.toLowerCase(),
  producto_keywords:generarKeywords(titulo),
  precio: Math.round(Number(precio)),
  stock:Number(stockProducto),
  descripcion:descripcion,
   images: imagenesBase64Editadas
  //img:jsonAEditar.img//las rutas de los img VIEJAS
 
};


  console.log("producto editado listo:", json);

  

  //ENVIAMOS LOS DATOS AL BACKEND, EDITARPRODUCTO

  //---------------------------------------------------
  //---------- revisamos si esta logeado---------------
  //---------------------------------------------------

   const user = auth.currentUser;

  if (!user) {
    spiner(false)
    alert("No estás logueado");
    return;
  }

  // ---------------------------------------------------
  // 4) ENVIAR A FUNCTION DE FIREBASE 
  // ---------------------------------------------------
try{
  const token = await auth.currentUser.getIdToken();

fetch("https://us-central1-gmmotorepuestos-ventas.cloudfunctions.net/editarProducto", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(json)
});

  spiner(false)
  alert("Datos Actualizados correctmente")
} catch (e) {
  spiner(false)
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



window.name = "ML_IMGS";
document.getElementById("btnML").addEventListener('click',()=>{
  window.open("https://www.mercadolibre.com.ar/", "ML_PAGE");

})


function mostrarPanelImagenes(idStrig){

  let id=Number(idStrig)

    if(imagenesML.length==0){


        alert("No hay imagenesML cargadas");
        
        return

    }

   divContenedorEditar.style.display="flex"
    imagenesDivML.innerHTML='';

  // ====== RENDERIZAR IMÁGENES ====== ❌
    let imgEditar = document.getElementById("muestraImgEditar");
    imgEditar.src = jsonAEditar.img[id];

    //========= RENDERIZAMOS LAS IMAGENES DE ML ============
    imagenesML.forEach(srcImgML=>{
       const div = document.createElement("div");
          
          div.setAttribute('data-idEditar',id);
          div.className = "imgItem";
      
          const img = document.createElement("img");
          img.className = "imgItemML";
          img.src = srcImgML;
      
          div.appendChild(img);
          imagenesDivML.appendChild(div);
      
          div.addEventListener("click", () => {

            
          divContenedorEditar.style.display="none";  
            //colocamos la img en VP
            document.getElementById("img404_"+id).src=srcImgML
            //colocamos la img en el array para enviar al backend
            newArrayEditImg[id]=srcImgML;
            console.log("✅ imagenes lista para enviar al backend")
            console.log(newArrayEditImg)
          });
    })

}


function parseNumeroAR(valor) {
  if (typeof valor === "number") return valor;

  return Number(
    valor
      .replace(/\./g, "") // quita separador de miles
      .replace(",", ".")  // convierte decimal a formato JS
  );
}

//colocamos e listener en las img
document.getElementById("rowDivImgVP").addEventListener('click',(e)=>{

  console.log("click👌👌")

  let img= e.target.closest('.img-wrapper');

  if(!img)return

  let id=img.dataset.numero;

  console.log(id)

  mostrarPanelImagenes(id)

})