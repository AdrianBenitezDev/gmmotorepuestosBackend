let valorActualOption=0;

// ====== SPINNER ======
function spinFalse() {
  document.getElementById('overlay').style.display = "none";
}
function spinTrue() {
  document.getElementById('overlay').style.display = "flex";
}

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
  eleCategoria.innerHTML+=`<option ${index==0?"selected":''} value="${e}">${e}</option>`
})


eleCategoria.addEventListener("change",(e)=>cargarProductos(e.target.value))


const owner = "AdrianBenitezDev";
const repo = "gmmotorepuestosBackend";

async function cargarProductos(categoriaSelected) {
  valorActualOption=categoriaSelected;

  if(categoriaSelected==categoriasTextos[0]){
    return;
  }
    spinTrue();
    try{

      //con RAW para evitar los limites
      let apiURL = `https://script.google.com/macros/s/AKfycbx-YwE7fkQKIyiQV13JPs0iIxRWw-nohtciTnR0Gb2G_ef6qtWSHSDEro_ipWeiBnTtKg/exec?accion=datos&categoria=${categoriaSelected}`
  
      console.log(apiURL)
      //tiene 60 consultas por hora, si ni te autenticas con tokens
//let apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/categorias/${categoriaSelected}/datos.json`;
console.log(apiURL)

let res = await fetch(apiURL);

 let contenedor = document.getElementById("CategoriaAndProductos");
    contenedor.innerHTML = ""; // limpiar antes 



if (!res.ok) {
  console.error("No existe datos.json");
  spinFalse();
  contenedor.innerHTML = "<h3>No hay productos para la sección elegida</h3>"; 

  return;
}

let datosJson = await res.json();

console.log("cargarProductos:");
console.log(datosJson);
jsonActual=datosJson;

   
   
            
    // --------------------------------------------
    // ------------ FIN de categoria --------------
    // --------------------------------------------


 panelProductoNav(1)
    spinFalse()
     }catch(error){
      console.error(error)
    spinFalse();
    return
    }
    
}



function navMas(actual){
  let maximo=Number(Object.values(jsonActual).length)
  console.log(maximo)
  let numNav = Math.floor(maximo / 10);
    console.log(numNav)
  if(actual<numNav){

    let newActual=actual+1;

 panelProductoNav(newActual)

  }
}

function navMenos(actual){
   if(actual>1){

    let newActual=actual-1;

 panelProductoNav(newActual)
   
}

}

function panelProductoNav(numeroNavActual){

   let contenedorNav = document.getElementById("CategoriaAndProductos");
    contenedorNav.innerHTML = ""; // limpiar antes

  let cantidadProductos=Object.values(jsonActual).length;

  //calculamos los intervamos del nav
  let inicioNav=(Number(numeroNavActual)*10)-10;
  
  let finNav=inicioNav+10;

  console.log(cantidadProductos)//1
  console.log(inicioNav)//0
  console.log(finNav)//10

  //obtenemos el fin de la iteración
let terminarDeIterar=cantidadProductos<finNav?cantidadProductos:finNav;



//agregamos el navegador de productos

  contenedorNav.innerHTML+=`<div class="row navegador" id="navHeader"> 
  
      <button onclick="navMenos(${numeroNavActual})">&lt</button> Mostrando ${inicioNav} al ${terminarDeIterar} de ${cantidadProductos} Productos Totales <button onclick="navMas(${numeroNavActual})">&gt</button>

  </div>
  <br>`

  //realizamos la iteración
  for (let index = inicioNav; index < terminarDeIterar; index++) {
    
    let json=Object.values(jsonActual)[index];



    console.log("dentro de nav")
    console.log(json)

    
            // crear card
            const card = document.createElement("div");
            card.className = "card row";
            card.innerHTML = `

                
            <img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${json.categoria}/${json.id}/${json.img[0]}">


                <h3>${json.producto}</h3>

                <h3 style="color:red;">$ ${json.precio}</h3>

                 <button onclick="cargarEditProducto('${json.categoria}','${json.id}')" class="btn-edit">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       width="18" height="18"
                       viewBox="0 0 24 24"
                       fill="none"
                       stroke="currentColor"
                       stroke-width="2"
                       stroke-linecap="round"
                       stroke-linejoin="round">
                     <path d="M12 20h9"/>
                     <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                   </svg>
                   Editar 
                 </button>


                 <button onclick="deleteProducto('${json.categoria}','${json.id}','${json.producto}')">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
                   </svg>
                
                   Eliminar  
                
                 </button>`;

            contenedorNav.appendChild(card);

  }

  //agregamos el navegador de productos en el bottom

  contenedorNav.innerHTML+=`
  
  <br>
  <div class="row navegador" id="navHeader"> 
    <button onclick="navMenos(${numeroNavActual})">&lt</button> Mostrando ${inicioNav} al ${terminarDeIterar} de ${cantidadProductos} Productos Totales <button onclick="navMas(${numeroNavActual})">&gt</button>
  </div>`;
}

















//-----------------------------------------------------------------------------------------------
//----------------------------------------en desuso revisar--------------------------------------

//    Object.values(datosJson).forEach(prod => {
       
//       console.log(prod)
      
//       console.log(prod.producto)
            
// // <button onclick="mostrarProducto('${archivo.download_url}')">
// //                     Ver producto
// //                 </button>

//             // crear card
//             let card = document.createElement("div");
//             card.className = "card row";
//             let urlImagen=`https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${prod.categoria}/${prod.id}/${prod.img[0]}`
//             console.log(urlImagen)
//             card.innerHTML = `

//             <img style="width:100px; height:100px; overflow:visible;" src="${urlImagen}">


//                 <h3>${prod.producto}</h3>

//                  <h3>$ ${prod.precio}</h3>
                
//                <button onclick="cargarEditProducto('${categoriaSelected}','${prod.id}')" class="btn-edit">
//                   <svg xmlns="http://www.w3.org/2000/svg"
//                       width="18" height="18"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-width="2"
//                       stroke-linecap="round"
//                       stroke-linejoin="round">
//                     <path d="M12 20h9"/>
//                     <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
//                   </svg>
//                   Editar 
//                 </button>


//                 <button onclick="deleteProducto('${categoriaSelected}','${prod.id}','${prod.producto}')">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
//                   </svg>
                
//                   Eliminar  
                
//                 </button>`;

//             contenedor.appendChild(card);
        
//     });