
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAOk_ze32aJXfleQcjYoOgN7yQox46pygk",
    authDomain: "gmmotorepuestos-ventas.firebaseapp.com",
    projectId: "gmmotorepuestos-ventas"
  };

  const app = initializeApp(firebaseConfig);
 export  const db = getFirestore(app);
 
// 🔥 Base de datos: productos
export const dbProducto = getFirestore(app, "gmmotorepuestos-productos");
