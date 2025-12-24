document.getElementById("btnCP").addEventListener('click', crearProducto);

async function crearProducto() {

  let titulo = document.getElementById("tituloP").value;
  let precio = document.getElementById("inputPrecio").value;
  let descripcion = document.getElementById("descripcionP").value;
  let categoria = document.getElementById("categorias");

  // VALIDACIÓN
  if (titulo == '' || precio == '' || descripcion == '' || categoria.value == categoria.options[0].value) {
    alert("Debe completar todos los datos");
    return;
  }else if(arrayImgSeleccionadas.length==0){
    alert("debe seleccionar alguna imagen para el producto")
  }else{

    for (let index = 0; index < 5; index++) {
      if(arrayImgSeleccionadas.length<index){
        arrayImgSeleccionadas.push("../Image404.png")
      }
      
    }
   
spinTrue();
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

let d = new Date();
let ms = d.getMilliseconds();
let m = d.getMinutes();
let mt = d.getMonth() + 1; // Sumamos 1 porque los meses en JS van de 0 a 11
let hs = d.getHours();
let fy = d.getFullYear();
let dy = d.getDate(); // Usamos getDate() para el día del mes (1-31) en lugar de getDay() (0-6 día semana)

// Opción 1: Formato de fecha y hora estándar
let fechaCompleta = `${ms}_${m}_${hs}_${dy}${mt}${fy}`;

let nombreDelProducto = "producto_"+fechaCompleta;
let nuevasRutas = [];
let arrayImg=[];

// Recorrer imágenes
docImagenes.forEach((img, index) => {

    // si no existe esa imagen seleccionada → imagen de error
    if (!arrayImgSeleccionadas[index]) {
      arrayImg.push("404")
        img.src = "./Image404.png";
        return;
    }

    const extension = ".jpg";
    const nuevoNombre = `imagen_${index}_${fechaCompleta}${extension}`;

    //url de la imagen (cuando renderizamos la usamos como base y agregamos el index)
   // let newSrc= `https://raw.githubusercontent.com/AdrianBenitezDev/gmmotorepuestosBackend/main/categorias/${categoria.value}/${nuevoNombre}`;

     arrayImg.push(index);
    nuevasRutas.push(nuevoNombre);

});


// 5) Convertir el DOM virtual ya modificado en string HTML nuevamente
const htmlModificado = docVirtual.body.innerHTML;

// 6) Armar tu documento final


  // ---------------------------------------------------
  // 2) CONVERTIR IMÁGENES SELECCIONADAS A BASE64
  // ---------------------------------------------------
const imagenesBase64 = await Promise.all(
  arrayImgSeleccionadas.map(
    (url, index) => convertirImagenABase64(url, nuevasRutas[index])
  )
);


    // -------------------------------------------------
  // 3) GENERAMOS UN NUMERO RANDOM PARA EL NAME
  // ---------------------------------------------------

  // ---------------------------------------------------
  // 3) ARMAR PAYLOAD PARA APPS SCRIPT
  // ---------------------------------------------------


  const json = {
    jsonDatos:{
  categoria: categoria.value,
  id: nombreDelProducto,
  producto:titulo,
  precio:precio,
  descripcion:descripcion,
  img:nuevasRutas
    },
  images: imagenesBase64
};


  console.log("json listo:", json);

  // ---------------------------------------------------
  // 4) ENVIAR A APPS SCRIPT
  // ---------------------------------------------------

  //para pruebas
  //let urlExcel="https://script.google.com/macros/s/AKfycbzjWcAHodsQeqmYdZfkifFIccsS5gYSjPwF1pCSmP0p/dev";
 

  //para producción
  let urlExcel="https://script.google.com/macros/s/AKfycbx-YwE7fkQKIyiQV13JPs0iIxRWw-nohtciTnR0Gb2G_ef6qtWSHSDEro_ipWeiBnTtKg/exec";
   console.log(urlExcel)

  try {
  resp = await fetch(urlExcel,{
  method: "POST", headers: {
    "Content-Type": "text/plain"  // 👈 TRUCO CLAVE: NO HAY OPTIONS
  },
  body: JSON.stringify(json)
})
 const texto = await resp.text(); // <-- aquí está la respuesta REAL
 // console.log("Respuesta del backend:", texto);

  spinFalse();
  alert("datos cargados correctmente")
} catch (e) {
  spinFalse();
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
