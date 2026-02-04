import { jsonActual,setValorJsonActual } from "./config.js";
import { dbProducto } from "./firebaseConfig.js";
import {spiner} from "./spin.js";
import { busquedaPalabra } from "./busquedaPalabra.js"

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
    limit,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


import { categoriasTextos, owner, repo } from "./config.js";


   let contenedorNav = document.getElementById("busquedaProductosInicio");






let selectCategoria=document.getElementById("categorias");

//cargamos en el elemento select las categorias
categoriasTextos.forEach((e,index)=>{
  selectCategoria.innerHTML+=`<option ${index==0?"selected":''} value="${e}">${e}</option>`
})

//cuando cambiamos el valor del select ejecutamos cargarProductos
selectCategoria.addEventListener("change",(e)=>cargarProductos(e.target.value))


async function cargarProductos(categoriaSelected) {
  //valorActualOption=categoriaSelected;

  if(categoriaSelected==categoriasTextos[0]){
    return;
  }
    spiner(true);
    try{

      
const q = query(
  collection(dbProducto, "productos"),
  where("categoria", "==", categoriaSelected)
);

const snapshot = await getDocs(q);


//lo convertimos en arra de bjetos ideal para rednderizar
const datosJson = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));


// [
//   { id: "abc123", nombre: "...", precio: 12000 },
//   { id: "xyz789", nombre: "...", precio: 9500 }
// ]



 let contenedor = document.getElementById("CategoriaAndProductos");
    contenedor.innerHTML = ""; // limpiar antes 



if (datosJson.length==0) {
  console.error("No existe datos.json");
  
    spiner(false);

  contenedor.innerHTML = "<h3>No hay productos para la sección elegida</h3>"; 

  return;
}
setValorJsonActual(datosJson);
    // --------------------------------------------
    // ------------ FIN de categoria --------------
    // --------------------------------------------


 panelProductoNav(1)
    spiner(false)
     }catch(error){
      console.error(error)
    spiner(false)
    return
    }
    
}




let btnBusquedaInicio = document.getElementById("btnBuscarInicio");



btnBusquedaInicio.addEventListener('click', async () => {

  const input = document.getElementById("inputBusquedaInicio").value;

  if(input==''){
    alert("Debe ingresar el nombre del producto")
    return
  }

  document.getElementById("busquedaProductosInicio").innerHTML = '';
  document.getElementById("visorProducto").innerHTML = '';

  spiner(true);

  let resultados= await busquedaPalabra(input)

  cagarCardProductos(resultados);

  spiner(false)
});


function cagarCardProductos(jsonObj){
    
  let contenedorBusqueda = document.getElementById("busquedaProductosInicio");
  contenedorBusqueda.innerHTML = "";

  // guardamos estado actual
  setValorJsonActual(jsonObj);

  // si no hay resultados
  if (Object.keys(jsonObj).length === 0) {
    contenedorBusqueda.innerHTML = "<h3>No se encontraron resultados</h3>";
    return;
  }

  panelProductoNav(1)

  
}

document.getElementById("btnBorrarInicio").addEventListener("click",()=>{
    document.getElementById("inputBusquedaInicio").value="";
    document.getElementById("inputBusquedaInicio").focus();

    
})

// FUNCION PANEL PRODUCTOS NAV (copia modificada de... generarCardProductos en carpeta dep)
function panelProductoNav(numeroNavActual){

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

//si bolean stock esta ACTIVADO se agrega una cabecera correspondiente

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
            card.className = "cardProductoBusqueda"
            card.className += json.stock==0?" cardPBDisabled":" cardPBEnabled";


            // si stock == true renderizamos un HTML sino renderizamos otro

            if(booleanStock){

              let name=json.producto.slice(0,20);

//si STOCK esta ACTIVADO
 card.innerHTML = `

            
            ${json.stock==0?'<span class="labelStockBusqueda" >Sin Stock</span>':''}
                
            <img style="width:100px; height:100px; overflow:visible;" src="${json.img[0]}">

                <h3>${name}...</h3>

                <input value=${json.stock} type="number" id="stock_${json.id}">

                 <button  class="btn-stock"
                          data-id="${json.id}">

                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Guardar">
                      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 2H8v6h6V4zm-2 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                    </svg>
                
                   Guardar  
                
                 </button>`;



            }else{
//si stock esta desactivado

            card.innerHTML = `

            
            ${json.stock==0?'<span class="labelStockBusqueda" >Sin Stock</span>':''}
                
            <img style="width:100px; height:100px; overflow:visible;" src="${json.img[0]}">


                <h3>${json.producto}</h3>

                <h3 style="color:red;">$ ${json.precio}</h3>

              <button 
                class="btn-vender ${json.stock == 0 ? 'btnDisabled' : ''}"
                ${json.stock == 0 ? 'disabled' : ''}

                data-categoria="${json.categoria}"
                data-id="${json.id}"
                data-producto="${json.producto}"
                data-precio="${json.precio}"
                data-img="${json.img[0]}">
                
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
                </svg>

                Vender
              </button>

                `;
            }


            contenedorNav.appendChild(card);

  }

  //agregamos el navegador de productos en el bottom

  contenedorNav.innerHTML+=`
  
  <br>
  <div class="row navegador" id="navHeader"> 
    <button class="btn-navegador" data-direccion="menos" data-actual=${numeroNavActual} >&lt</button> Mostrando ${inicioNav} al ${terminarDeIterar} de ${cantidadProductos} Productos Totales <button class="btn-navegador" data-direccion="mas" data-actual=${numeroNavActual} >&gt</button>
  </div>`;


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


async function actualizarStock(idDoc,valorActual){
  //tomamos el valor actul
  let newStock=document.getElementById("stock_"+idDoc).value;

  if(valorActual==newStock){
    alert("❌ Error: El numero de Stock debe ser diferente al actual!")
    return
  }

  const stock = Number(newStock);

  if (Number.isNaN(stock)) {
    return;
  }

//realizamos el fetch
  if (!Number.isInteger(stock)) {
  return;
 }
 //realizamos la actualización del stock

 spiner(true);
 

  try {
    const ref = doc(db, "productos", idDoc);

    await updateDoc(ref, {
      stock: stock
    });

    console.log("✅ Stock actualizado");
    
   spiner(false);
  } catch (error) {
    console.error("❌ Error actualizando stock:", error);
    
   spiner(false);
  }



}

//colocamos los listener para los btn del NAVEGADOR NAV
contenedorNav.addEventListener('click',(e)=>{
  const btnNav= e.target.closest(".btn-navegador");
  if (!btnNav) return;

  const direccion=btnNav.direccion;
  let numActual=btnNav.actual;

  if(direccion=="mas"){
    navMas(numActual)
  }else{
    navMenos(numActual)
  }
})


//colocamos los listener globales

contenedorNav.addEventListener("click", e => {
  const btn = e.target.closest(".btn-stock");
  if (!btn) return;

  const id = btn.dataset.id;
  const input = document.getElementById(`stock_${id}`);
  const stock = Number(input.value);

  actualizarStock(id, stock);
});

contenedorNav.addEventListener("click", e => {
  const btn = e.target.closest(".btn-vender");
  if (!btn || btn.disabled) return;

  const producto = [
    btn.dataset.categoria,
    btn.dataset.id,
    btn.dataset.producto,
    btn.dataset.precio,
    1,
    btn.dataset.img
  ];

  addProduct(producto);
});
