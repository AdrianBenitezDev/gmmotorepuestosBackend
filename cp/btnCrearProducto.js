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

    //Debug
    console.log(arrayImgSeleccionadas);

    for (let index = 0; index == 5; index++) {
      if(arrayImgSeleccionadas[index]==undefined){
        arrayImgSeleccionadas.push("../Image404.png");
      } 
    }
   
    //Debug
    console.log(arrayImgSeleccionadas);
   
spiner(true);
  //  alert("Enviando datos…");

  // ---------------------------------------------------
  // 1) TOMAR EL HTML REAL DE LA VISTA PREVIA
  // ---------------------------------------------------
 // 1) TOMAR EL HTML REAL DE LA VISTA PREVIA
const vistaPhtml = document.getElementById("vistaP").innerHTML;

// 2) Crear DOM virtual
const parser = new DOMParser();
const docVirtual = parser.parseFromString(vistaPhtml, "text/html");

// 3) Obtener imágenes
let docImagenes = Array.from(docVirtual.getElementsByClassName("img404"));

// Mover imagen 4 → 0 en arrayImgSeleccionadas
docImagenes.unshift(docImagenes.splice(4, 1)[0]);

//--------------CREAR UNA VARIABLE PARA EL ID------------------------

//cramos el valor del id
if(idObtenido==''){
  //definimos la parte del id si no se realizo antes
  idObtenido=crearIdDelProducto();
}

nombreDelProducto="producto_"+idObtenido;


let nuevasRutas = [];
let arrayImg=[];

// Recorrer imágenes
docImagenes.forEach((img, index) => {

    // si no existe esa imagen seleccionada → imagen de error
    if (!arrayImgSeleccionadas[index]) {

        arrayImg.push("404");
        img.src = "./Image404.png";
        return;

    }

    const nuevoNombre = `imagen_${index}_${idObtenido}`;

    //url de la imagen (cuando renderizamos la usamos como base y agregamos el index)
   // let newSrc= `https://raw.githubusercontent.com/AdrianBenitezDev/gmmotorepuestosBackend/main/categorias/${categoria.value}/${nuevoNombre}`;

     arrayImg.push(index);
    nuevasRutas.push(nuevoNombre);

});


// 5) Convertir el DOM virtual ya modificado en string HTML nuevamente
//const htmlModificado = docVirtual.body.innerHTML;

// 6) Armar tu documento final


  // ---------------------------------------------------
  // 2) CONVERTIR IMÁGENES SELECCIONADAS A BASE64
  // ---------------------------------------------------
const imagenesBase64 = await Promise.all(
  //array con la url de la imagen y en null tiene "404"
  arrayImgSeleccionadas.map(
    (url, index) => {
    
    if(!objetoImgFromPc[index]?.base64){
                convertirImagenABase64(url, nuevasRutas[index])
    }else{
      objetoImgFromPc[index]
    }

    }
  )
);


    // -------------------------------------------------
  // 3) GENERAMOS UN NUMERO RANDOM PARA EL NAME
  // ---------------------------------------------------

  // ---------------------------------------------------
  // 3) ARMAR PAYLOAD PARA APPS SCRIPT
  // ---------------------------------------------------


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

console.log(imagenesBase64)

let crearFlyerCheck=document.getElementById("checkFlyer").checked;

if(crearFlyerCheck){
    crearFlyer(newProducto);
}


  console.log("json listo:", newProducto);

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
  console.log("this error")
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