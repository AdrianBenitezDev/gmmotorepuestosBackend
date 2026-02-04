import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { actualizarBooleanStock } from "./config.js";

const auth = getAuth();

document.getElementById("btnStock").addEventListener('click',()=>{

    actualizarBooleanStock(true);

    document.getElementById("titleStockAndVentaLocal").textContent="Stock y Precios";
    
    document.getElementById("ventasOnline").style.display="none";
    document.getElementById("container").style.display="flex";
    document.getElementById("container").innerHTML=``;
    document.getElementById("divBusquedaInicio").style.display="flex";
    document.getElementById("busquedaProductosInicio").innerHTML="";

    document.getElementById("categorias").selectedIndex=0;

    
})


export async function actualizarStock(idDoc,valorActualStock,valorActualPrecio){
  //tomamos el valor actul
  let newStock=document.getElementById("stock_"+idDoc).value;

  let newPrecio=document.getElementById("precio_"+idDoc).value;

  if(valorActualStock==newStock){
    alert("❌ Error: El numero de Stock debe ser diferente al actual!")
    return
  }
   if(valorActualPrecio == newPrecio){
    alert("❌ Error: El valor del Precio debe ser diferente al actual!")
    return
  }

  const stock = Number(newStock);
  const precio = Number(newPrecio);

  if (Number.isNaN(stock)) {
    return;
  }
   if (Number.isNaN(precio)) {
    return;
  }

//realizamos el fetch
  if (!Number.isInteger(stock)) {
  return;
 }
   if (!Number.isInteger(precio)) {
  return;
 }
 //realizamos la actualización del stock

 spiner(true);
 
//---------------------------------------------------
//---------- revisamos si esta logeado---------------
//---------------------------------------------------

    const user = auth.currentUser;
 
   if (!user) {
     alert("No estás logueado");
     return;
   }
 
   // ---------------------------------------------------
   // 4) ENVIAR A FUNCTION DE FIREBASE 
   // ---------------------------------------------------
 try{
   const token = await auth.currentUser.getIdToken();

    let newStockAndPrecio={
      stock: stock,
      precio:precio,
      id:idDoc
    }
 
 fetch("https://us-central1-gmmotorepuestos-ventas.cloudfunctions.net/actualizarProducto", {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`
   },
   body: JSON.stringify(newStockAndPrecio)
 });
 
 
   spiner(false);
   alert("✅ Stock y Precio Actualizado Correctmente")
   //recargamos la pagina
   location.reload();
 
 } catch (e) {
    spiner(false);
    alert("❌ Error al intentar Actualizar el Stock y Precio")
   console.log("this error")
   console.error(e);
  
   return;
 }


}
