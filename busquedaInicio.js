const { categoriasTextos, owner, repo } = window.APP_CONFIG;


let selectCategoria=document.getElementById("categorias");

categoriasTextos.forEach((e,index)=>{
  selectCategoria.innerHTML+=`<option ${index==0?"selected":''} value="${e}">${e}</option>`
})


selectCategoria.addEventListener("change",(e)=>cargarProductos(e.target.value))


async function cargarProductos(categoriaSelected) {
  valorActualOption=categoriaSelected;

  if(categoriaSelected==categoriasTextos[0]){
    return;
  }
    spiner(true);
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
  
    spiner(false);

  contenedor.innerHTML = "<h3>No hay productos para la sección elegida</h3>"; 

  return;
}

let datosJson = await res.json();

jsonActual=datosJson;

   
   
            
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




let divBusquedaInicio = document.getElementById("btnBuscarInicio");

divBusquedaInicio.addEventListener('click', async () => {

  
  const input = document.getElementById("inputBusquedaInicio");

  if(input==''){
    alert("Debe ingresar el nombre del producto")
    return
  }

  document.getElementById("busquedaProductosInicio").innerHTML = '';
  document.getElementById("visorProducto").innerHTML = '';

  spiner(true);



  const arrayTexto = input.value
    .toLowerCase()
    .trim()
    .split(/\s+/);

  const promesas = [];

  categoriasTextos.forEach((elemento, index) => {
    
   
  
    if (index !== 0) {
      promesas.push(traerJSON(arrayTexto, index));
    }

  });



  // esperar todas las categorías
  let resultadosPorCategoria = await Promise.all(promesas);

  // 🔥 UNIFICAR OBJETOS (NO flat)
  let resultados = Object.assign({}, ...resultadosPorCategoria);

  console.log("RESULTADOS:", resultados);

  cagarCardProductos(resultados);

  spiner(false)
});

async function traerJSON(arrayTxt, id) { 
    
  const apiURL = `https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${categoriasTextos[id]}/datos.json`;

  try {
    const res = await fetch(apiURL,{ cache: "no-store" });
    if (!res.ok) return {};

    const archivos = await res.json(); 

    const coincidencias = {};

    for (const key in archivos) {
      const prod = archivos[key];

      const coincide = arrayTxt.every(palabra =>
        prod.producto.toLowerCase().includes(palabra)
      );

      if (coincide) {
        coincidencias[key] = prod;
      }
    }

    return coincidencias;

  } catch (e) {
    return {};
  }
}

function cagarCardProductos(jsonObj){
    
  let contenedorBusqueda = document.getElementById("busquedaProductosInicio");
  contenedorBusqueda.innerHTML = "";

  // guardamos estado actual
  jsonActual = jsonObj;

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

   let contenedorNav = document.getElementById("busquedaProductosInicio");
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
                
            <img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${json.categoria}/${json.id}/${json.img[0]}">

                <h3>${name}...</h3>

                <input value=${json.stock} type="number" id="stock_${json.id}">

                 <button  onclick="actualizarStock('${json.categoria}','${json.id}','${json.stock}')">
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
                
            <img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${json.categoria}/${json.id}/${json.img[0]}">


                <h3>${json.producto}</h3>

                <h3 style="color:red;">$ ${json.precio}</h3>


                 <button  ${json.stock==0?'class="btnDisabled" disabled':''}  onclick="addProduct(['${json.categoria}','${json.id}','${json.producto}','${json.precio}',1])">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
                   </svg>
                
                   Vender  
                
                 </button>`;
            }


            contenedorNav.appendChild(card);

  }

  //agregamos el navegador de productos en el bottom

  contenedorNav.innerHTML+=`
  
  <br>
  <div class="row navegador" id="navHeader"> 
    <button onclick="navMenos(${numeroNavActual})">&lt</button> Mostrando ${inicioNav} al ${terminarDeIterar} de ${cantidadProductos} Productos Totales <button onclick="navMas(${numeroNavActual})">&gt</button>
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


async function actualizarStock(categoria,id,valorActual){
  //tomamos el valor actul
  let newStock=document.getElementById("stock_"+id).value;

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
 
  const json = {
  
  jsonDatos:{
    categoria:categoria,
    stock:newStock,
    id:id
    },
  type:"actualizarStock"
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

  let respuestaBackend=JSON.parse(texto);
 console.log(respuestaBackend);

   spiner(false);
 if(respuestaBackend.respuesta[0].code==200){

  alert("✅ Datos Actualizados correctmente")
 }else{

  alert("❌ Error al Actualizar el STOCK")
 }

} catch (e) {
  spiner(false);
  console.log("this error")
  console.error(e);

    alert("❌ Error al Actualizar el STOCK")
 
  return;
}


}