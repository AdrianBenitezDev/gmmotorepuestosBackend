import { categoriasTextos,repo,owner } from "../config.js";
import { jsonActual,setValorJsonActual } from "../config.js";
import { dbProducto } from "../firebaseConfig.js";
import {spiner} from "../spin.js"
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  import {deleteProducto} from './delete.js'
  import { cargarEditProducto } from "./edit.js";

export let valorActualOption="";

export function setValorActualOption(valor){
  valorActualOption=valor;
  console.log("valor actual de valorActualOption "+valorActualOption)
}


   let contenedorNav = document.getElementById("CategoriaAndProductos");

// ====== SPINNER ======
function spinFalse() {
  document.getElementById('overlay').style.display = "none";
}
function spinTrue() {
  document.getElementById('overlay').style.display = "flex";
}



//colocamos el change para el select (option de categorias)
let eleCategoria=document.getElementById("categorias");

eleCategoria.addEventListener("change",(e)=>cargarProductos(e.target.value))

//----------------- COLOCAMOS LAS OPTION PARA EL SELECT DE EDITAR en el div EDITAR---------------------








export async function cargarProductos(categoriaSelected) {

  setValorActualOption(categoriaSelected);

  if(categoriaSelected==categoriasTextos[0]){
    return;
  }
    spinTrue();
    try{


      //realizamos la consulta la base de datos
  const q = query(
    collection(dbProducto, "productos"),
    orderBy("categoria"),
    where("categoria", "==", categoriaSelected)
  );


  const snap = await getDocs(q);
   spiner(false);
  
let datosJson = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));


 let contenedor = document.getElementById("CategoriaAndProductos");
    contenedor.innerHTML = ""; // limpiar antes 

// if (!res.ok) {
//   console.error("No existe datos.json");
//   spinFalse();
//   contenedor.innerHTML = "<h3>No hay productos para la sección elegida</h3>"; 

//   return;
// }

console.log("cargarProductos:");
console.log(datosJson);
setValorJsonActual(datosJson)

   
   
            
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

export function panelProductoNav(numeroNavActual){

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

                
            <img style="width:100px; height:100px; overflow:visible;" src="${json.img[0]}">


                <h3>${json.producto}</h3>

                <h3 style="color:red;">$ ${json.precio}</h3>

                 <button class="btn-edit" data-id="${json.id}" >
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


                 <button class="btn-delete" data-id="${json.id}" data-prod="${json.producto}">
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


contenedorNav.addEventListener("click", e => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;

  const id = btn.dataset.id;
  const nombreProducto= btn.dataset.prod;

  deleteProducto(id, nombreProducto);
});

contenedorNav.addEventListener("click",(e)=>{

  let btn=e.target.closest(".btn-edit");
  if(!btn)return;

  let id=btn.dataset.id;
  cargarEditProducto(id);

})












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