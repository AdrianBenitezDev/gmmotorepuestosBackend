const { categoriasTextos, owner, repo } = window.APP_CONFIG;


let divBusquedaInicio = document.getElementById("btnBuscarInicio");



divBusquedaInicio.addEventListener('click', async () => {

  
  const input = document.getElementById("inputBusquedaInicio");

  if(input==''){
    alert("Debe ingresar el nombre del producto")
    return
  }

  document.getElementById("CategoriaAndProductos").innerHTML = '';
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
    
  let contenedorBusqueda = document.getElementById("CategoriaAndProductos");
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
    document.getElementById("contenedorEdit").style.display="none";

    document.getElementById("CategoriaAndProductos").innerHTML=`<p>Debe seleccinar una categoria</p>`;
   
    document.getElementById("visorProducto").innerHTML="";
   
    eleCategoria.selectedIndex = 0;
    
})


// FUNCION PANEL PRODUCTOS NAV (copia modificada de... generarCardProductos en carpeta dep)

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
