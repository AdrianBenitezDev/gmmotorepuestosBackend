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

async function cargarProductos(id) {
  valorActualOption=id;

  if(id==categoriasTextos[0]){
    return;
  }
    spinTrue();
    try{

let apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/categorias/${id}`;
    const res = await fetch(apiURL);
    const archivos = await res.json();

    let contenedor = document.getElementById("CategoriaAndProductos");
    contenedor.innerHTML = ""; // limpiar antes

   
    // --------------------------------------------
    // ------------ cabecera de categoria----------
    // --------------------------------------------

    document.getElementById("categoriaSeleccionada").innerHTML=`
    
    <h3>Categoria Seleccionada: ${id.toUpperCase()}</h3>
    
    `;            
    // --------------------------------------------
    // ------------ FIN de categoria --------------
    // --------------------------------------------


    archivos.forEach(archivo => {
        if (archivo.name.endsWith(".html")) {
            
// <button onclick="mostrarProducto('${archivo.download_url}')">
//                     Ver producto
//                 </button>

            // crear card
            const card = document.createElement("div");
            card.className = "card row";
            card.innerHTML = `

            <img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${id}/${archivo.name.replace(".html","").replace("prod_","imagen_0_")}.jpg">


                <h3>${archivo.name.replace(".html","")}</h3>
                
               <button onclick="editProducto('${archivo.name}')" class="btn-edit">
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
                  Editar Producto
                </button>


                <button onclik="deleteProducto()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5-6h4l1 2H9l1-2z"/>
                  </svg>
                
                  Eliminar Producto 
                
                </button>`;

            contenedor.appendChild(card);
        }
    });
    spinFalse()
     }catch{
    spinFalse();
    return
    }
    
}

function editProducto(name){
  alert("editar producto")
  document.getElementById("visorProducto").scrollIntoView();
}

function deleteProducto(id){
  let eliminar=confirm("desea eliminar el producto "+id)

  if(eliminar){
    alert("se elimini el producto "+id)


    cargarProductos(valorActualOption)
  }else{
 alert("proceso cancelado")
  }

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

