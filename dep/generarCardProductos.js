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
      const apiURL = `https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${categoriaSelected}/datos.json`;

      //tiene 60 consultas por hora, si ni te autenticas con tokens
//let apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/categorias/${categoriaSelected}/datos.json`;
console.log(apiURL)

const res = await fetch(apiURL);

 let contenedor = document.getElementById("CategoriaAndProductos");
    contenedor.innerHTML = ""; // limpiar antes 



if (!res.ok) {
  console.error("No existe datos.json");
  spinFalse();
  contenedor.innerHTML = "<h3>No hay productos para la sección elegida</h3>"; 

  return;
}

const datosJson = await res.json();

console.log("cargarProductos:");
console.log(datosJson);

   
   
            
    // --------------------------------------------
    // ------------ FIN de categoria --------------
    // --------------------------------------------


    Object.values(datosJson).forEach(prod => {
       
      console.log(prod)
      
      console.log(prod.producto)
            
// <button onclick="mostrarProducto('${archivo.download_url}')">
//                     Ver producto
//                 </button>

            // crear card
            let card = document.createElement("div");
            card.className = "card row";
            let urlImagen=`https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${prod.categoria}/${prod.id}/${prod.img[0]}`
            console.log(urlImagen)
            card.innerHTML = `

            <img style="width:100px; height:100px; overflow:visible;" src="${urlImagen}">


                <h3>${prod.producto}</h3>
                
               <button onclick="editProducto('${categoriaSelected}','${prod.id}')" class="btn-edit">
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


                <button onclick="deleteProducto('${categoriaSelected}','${prod.id}','${prod.producto}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
                  </svg>
                
                  Eliminar  
                
                </button>`;

            contenedor.appendChild(card);
        
    });
    spinFalse()
     }catch(error){
      console.error(error)
    spinFalse();
    return
    }
    
}

function editProducto(categoria,id){
  alert("editar producto")
  document.getElementById("visorProducto").scrollIntoView();
}

function mostrarProducto(url) {

    spinTrue();
    fetch(url)
        .then(res => res.text())
        .then(html => {
            spinFalse()
            document.getElementById("visorProducto").innerHTML = html;

            document.getElementById("visorProducto")
                .scrollIntoView({ behavior: "smooth", block: "start" });
        });
}

// cargarProductos();

