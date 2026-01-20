

const { owner, repo } = window.APP_CONFIG;

let arrayVentas;

  let contenedor = document.getElementById("tabVentasOnline");
  
  let textoNotificacion=document.getElementById("notiVO");


  export {traerVentas} 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAOk_ze32aJXfleQcjYoOgN7yQox46pygk",
    authDomain: "gmmotorepuestos-ventas.firebaseapp.com",
    projectId: "gmmotorepuestos-ventas"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  
  import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    limit,
    getDocs
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  //TRAEMOS TOMAS LAS VENTAS DE ESTE MES
  
const ventasDelMes = query(
  collection(db, "ventas"),
  where("estado_pago", "==", "pendiente"),
  orderBy("fecha", "desc"),
  limit(10)
);



  //APLICAMOS ONSNAPSHOT
  const ventasRef = collection(db, "ventas");

  const q = query(ventasRef, orderBy("fecha", "desc"));

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("🟢 Nueva venta:", change.doc.data());
        notificar()

        // renderVenta(change.doc.data());

      }

      if (change.type === "modified") {
        console.log("🟡 Venta modificada:", change.doc.data());
      }

      if (change.type === "removed") {
        console.log("🔴 Venta eliminada");
      }
    });
  });





 async function traerVentas(){

contenedor.innerHTML='';

 arrayVentas = await getDocs(ventasDelMes);

 
console.log("arrayVentas")

console.log(arrayVentas)

arrayVentas.forEach(venta=>{
  let idVenta=venta.id; 
    let json=venta.data();

    console.log(json)

    if(json.carrito==true){

    renderVentaCarrito(json,idVenta)
    }else{
      
    renderVentaIndividual(json,idVenta)
    }
})
}


function renderVentaIndividual(data,idVenta) {
  const tr = document.createElement("tr");
  // tr.setAttribute("class","card")
  tr.innerHTML = `
    <td><img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${data.producto.categoria}/${data.producto.id}/imagen_0_${data.producto.id.replace('producto_','')}.jpg"></td>
    <td>${data.producto.producto}</td>
    <td>${data.cantidad}</td>
    <td>data.stock</td>
    <td>${data.producto.precio} $</td>
    <td>${data.total_pagar} $</td>
    <td>${data.envio}</td>
    <td>${data.estado_pago}</td>
    <td><button onClick="deleteCompra('${idVenta}','${data.producto.producto}')">Eliminar</button</td>
  `;
  contenedor.prepend(tr);
}

function renderVentaCarrito(data,idVenta){

  let array=data.arrayCarrito;
  
  let div=document.createElement("div");

  array.forEach((compra,index)=>{

            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td><img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${compra.categoria}/${compra.id}/imagen_0_${compra.id.replace('producto_','')}.jpg"></td>
              <td>${index+1}. ${compra.producto}</td>
              <td>${compra.cantidad}</td>
              <td>compra.stock</td>
              <td>${compra.precio} $</td>
              <td>${compra.total_pagar} $</td>
              <td>${compra.envio}</td>
              <td>${compra.estado_pago}</td>
              <td><button onClick="deleteCompra('${idVenta}','${compra.producto}')">Eliminar</button</td>
            `;
            div.prepend(tr);

  })

  contenedor.prepend(div);

}

function notificar(){

  textoNotificacion.style.display="flex";
  textoNotificacion.textContent=1;

}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnEliminar")) {
    deleteCompra(e.target.dataset.id);
  }
});


window.deleteCompra = async function (idVenta,nameProducto) {

  let confirm=confirm("¿Desea eliminar la compra seleccionada? \n "+ nameProducto);

  if(confirm){
spiner(true);
  
  const data = {
    action: "eliminarVenta",
    data: { idVenta }
  };

  const resp = await fetch(
    "https://us-central1-gmmotorepuestos-ventas.cloudfunctions.net/crearVentaPendiente",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );

  const res = await resp.json();
  console.log(res);

  if (res.ok === true) {
    alert("Compra eliminada con éxito!");
   // location.reload();
   traerVentas();
  } else {
    alert(res.error || "Error al eliminar la compra");
  }
  
  spiner(false);
  }else{

  }
  
};
