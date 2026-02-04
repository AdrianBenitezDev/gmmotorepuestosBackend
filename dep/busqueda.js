import { jsonActual,setValorJsonActual } from "../config.js";
import { dbProducto } from "../firebaseConfig.js";
import {panelProductoNav}from "./generarCardProductos.js"
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


let timer = null;


async function buscarProductos(texto) {
  texto = texto.toLowerCase().trim();

  if (texto.length < 2) return []; // anti spam

  const q = query(
    collection(dbProducto, "productos"),
    orderBy("producto_lower"),
    where("producto_lower", ">=", texto),
    where("producto_lower", "<=", texto + "\uf8ff"),
    limit(10)
  );

  const snap = await getDocs(q);
   spiner(false);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


const input = document.getElementById("inputBusqueda");

input.addEventListener("input", (e) => {
  clearTimeout(timer);

  timer = setTimeout(async () => {
    const texto = e.target.value;
    if(!texto.length>3){
      return
    }
     spiner(true);
    const resultados = await buscarProductos(texto);
    cagarCardProductos(resultados);
  }, 300);
});















let divBusqueda = document.getElementById("btnBuscar");



divBusqueda.addEventListener('click', async () => {


  
  const input = document.getElementById("inputBusqueda").value;


    if(input==''){
    alert("Debe ingresar el nombre del producto")
    return
  }


  document.getElementById("CategoriaAndProductos").innerHTML = '';
  document.getElementById("visorProducto").innerHTML = '';

  spiner(true);

 
  // esperar todas las categorías
  let resultadosPorCategoria =  await buscarProductos(input)

  cagarCardProductos(resultadosPorCategoria);

  spiner(false);
});


function cagarCardProductos(jsonObj){
    
  let contenedorBusqueda = document.getElementById("CategoriaAndProductos");
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


document.getElementById("btnBorrar").addEventListener("click",()=>{
    document.getElementById("inputBusqueda").value="";
    document.getElementById("inputBusqueda").focus();
    document.getElementById("contenedorEdit").style.display="none";

    document.getElementById("CategoriaAndProductos").innerHTML=`<p>Debe seleccinar una categoria</p>`;
   
    document.getElementById("visorProducto").innerHTML="";
   
    //eleCategoria.selectedIndex = 0;
    
})
