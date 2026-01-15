

let divBusqueda = document.getElementById("btnBuscar");



divBusqueda.addEventListener('click', async () => {


  
  const input = document.getElementById("inputBusqueda");


    if(input==''){
    alert("Debe ingresar el nombre del producto")
    return
  }


  document.getElementById("CategoriaAndProductos").innerHTML = '';
  document.getElementById("visorProducto").innerHTML = '';

  spinTrue();



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

  spinFalse();
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


document.getElementById("btnBorrar").addEventListener("click",()=>{
    document.getElementById("inputBusqueda").value="";
    document.getElementById("inputBusqueda").focus();
    document.getElementById("contenedorEdit").style.display="none";

    document.getElementById("CategoriaAndProductos").innerHTML=`<p>Debe seleccinar una categoria</p>`;
   
    document.getElementById("visorProducto").innerHTML="";
   
    eleCategoria.selectedIndex = 0;
    
})




// Object.entries(jsonObj).forEach(([key, json]) => {

//     const card = document.createElement("div");
//     card.className = "card row";

//     card.innerHTML = `
//       <img style="width:100px; height:100px;"
//         src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${json.categoria}/${json.id}/${json.img[0]}">

//       <h3>${json.producto}</h3>

//       <h3 style="color:red;">$${json.precio}</h3>

//       <button onclick="cargarEditProducto('${json.categoria}','${json.id}','${json.producto}')">

//       <svg xmlns="http://www.w3.org/2000/svg"
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
//         Editar 
//       </button>

//        <button onclick="deleteProducto('${json.categoria}','${json.id}','${json.producto}')">
//        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
//                   </svg>
//         Eliminar 
//       </button>
//     `;

//     contenedorBusqueda.appendChild(card);
//   });