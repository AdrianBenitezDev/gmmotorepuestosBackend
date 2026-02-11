// import { auth } from "../auth.js";
import {arrayImgSeleccionadas} from './obtnerimg.js'
import {spiner} from '../spin.js'
import {generarKeywords} from "../busquedaPalabra.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { crearFlyer } from './crearFlyer.js';

const auth = getAuth();

let nombreDelProducto='';
let idObtenido='';

let objetoImgFromPc=[]


document.getElementById("btnCP").addEventListener('click', ()=>{

    let stock = document.getElementById("stockP").value;
    if(stock==0){
              let confirmacion=confirm("Atención esta creando un producto con STOCK 0 \n NO estara habilitado para la Venta \n ¿Desea continuar?")
            if(confirmacion){
              crearProducto();
            }else{
              return;
            }
    }else{
      crearProducto();
    }
});

async function crearProducto() {

  let titulo = document.getElementById("tituloP").value;
  let precio = document.getElementById("inputPrecio").value;
  let descripcion = document.getElementById("descripcionP").value;
  let stock = document.getElementById("stockP").value;
  let categoria = document.getElementById("categorias");
  let precio_proveedor = document.getElementById("inputProveedor").value.trim()

  // VALIDACIÓN
  if (precio_proveedor =='' || titulo == '' || precio == '' || Number(precio) == 0 || descripcion == '' || categoria.value.toLowerCase() == categoria.options[0].value.toLowerCase()) {
    alert("Debe completar todos los datos");
    return;
    }else if(arrayImgSeleccionadas.length==0){
    alert("debe seleccionar alguna imagen para el producto")
    return;
  }else{


//cramos el valor del id
if(idObtenido==''){
  //definimos la parte del id si no se realizo antes
  idObtenido=crearIdDelProducto();
}

nombreDelProducto="producto_"+idObtenido;

spiner(true);
  //  alert("Enviando datos…");



const imagenesBase64 = [];

for (let index = 0; index < 5; index++) {

  const nombreImagen = `imagen_${index}_${idObtenido}`;
  const img = document.getElementById(`img404_${index}`);
  if (!img || !img.src) continue;

  const srcImagen = img.src;

  // 👉 imagen ya subida (https)
  if (srcImagen.startsWith("https")) {

    const resultado = await convertirImagenABase64(srcImagen, nombreImagen);
    imagenesBase64.push(resultado);

  } 
  // 👉 imagen cargada desde PC (data:image)
  else if (srcImagen.startsWith("data:image")) {

    const base64Puro = srcImagen.split(",")[1];
    imagenesBase64.push({
      name: nombreImagen,
      base64: base64Puro
    });

  }
}



  const newProducto = {
  categoria: categoria.value.toLowerCase(),
  id: nombreDelProducto,
  producto:titulo,
  producto_lower:titulo.toLowerCase(),
  proveedor:Number(precio_proveedor),
  precio:Number(precio),
  stock:Number(stock),
  descripcion:descripcion,
  producto_keywords:generarKeywords(titulo),
  img:nuevasRutas,
  images: imagenesBase64
};



let crearFlyerCheck=document.getElementById("checkFlyer").checked;

if(crearFlyerCheck){
    crearFlyer(newProducto);
}


  console.log("json listo:", newProducto);
  console.log(objetoImgFromPc)
  console.log(imagenesBase64)

  //---------------------------------------------------
  //---------- revisamos si esta logeado---------------
  //---------------------------------------------------

   const user = auth.currentUser;

  if (!user) {
    alert("No estás logueado");
    return;
  }

  // ---------------------------------------------------
  // 4) ENVIAR A FUNCTION DE FIREBASE 
  // ---------------------------------------------------
try{
  const token = await auth.currentUser.getIdToken();

fetch("https://crearProducto-xhlrljateq-uc.a.run.app", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(newProducto)
});


  spiner(false);
  alert("Producto creado Correctmente")
  //recargamos la pagina
  //location.reload();

} catch (e) {
   spiner(false);
  console.error(e);
 
  return;
  
    }
  }
}

  function convertirImagenABase64(url, nombreFinal) {
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
}

//Agregamos los listener de los img
const totalImgs = 5;



for (let i = 0; i < totalImgs; i++) {
  const img = document.getElementById(`img404_${i}`);

  img.addEventListener("click", async () => {
    //si no esta definido idObtenido
    if(idObtenido==''){
       idObtenido= crearIdDelProducto()
    }
console.log(idObtenido)
    const base64 = await cargarImagenPc(img.id);

    objetoImgFromPc[i] = {
      name: `imagen_${i}_`+idObtenido,
      base64
    };
  });
}

function cargarImagenPc(imgId) {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target.result;

        // mostrar imagen en el <img> correspondiente
        const img = document.getElementById(imgId);
        if (img) {
          img.src = base64;
        }

        resolve(base64);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    input.click();
  });
}

function crearIdDelProducto(){
            
          const d = new Date();

          const milis = String(d.getMilliseconds()).padStart(3, "0"); // 000–999
          const min   = String(d.getMinutes()).padStart(2, "0");
          const hora  = String(d.getHours()).padStart(2, "0");
          const dy    = String(d.getDate()).padStart(2, "0");
          const mes   = String(d.getMonth() + 1).padStart(2, "0");
          const fy    = d.getFullYear();

          const fechaCompleta = `${milis}_${min}_${hora}_${dy}_${mes}_${fy}`;

          return fechaCompleta;
}