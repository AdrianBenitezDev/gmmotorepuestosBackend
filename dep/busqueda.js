

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
