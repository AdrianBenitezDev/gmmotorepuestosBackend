
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
    orderBy,
    onSnapshot
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const ventasRef = collection(db, "ventas");

  const q = query(ventasRef, orderBy("fecha", "desc"));

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("🟢 Nueva venta:", change.doc.data());
         renderVenta(change.doc.data());
      }

      if (change.type === "modified") {
        console.log("🟡 Venta modificada:", change.doc.data());
      }

      if (change.type === "removed") {
        console.log("🔴 Venta eliminada");
      }
    });
  });


  const contenedor = document.getElementById("tabVentasOnline");


function renderVenta(data) {
  const div = document.createElement("tr");
  div.innerHTML = `
    <td><img style="width:100px; height:100px; overflow:visible;" src="https://raw.githubusercontent.com/${owner}/${repo}/main/categorias/${data.categoria}/${data.id}/imagen_0_${data.id.replace('producto_','')}.jpg"></td>
    <td>${data.produto}</td>
    <td>${data.cantidad}</td>
    <td>${data.stock}</td>
    <td>${data.precio}</td>
    <td>${data.envio}</td>
    <td>${data.estado}</td>
    <td>${data.accion}</td>
    <strong>${data.id}</strong> - ${data.categoria}
    <span>${data.estado_pago}</span>
  `;
  contenedor.prepend(div);
}

