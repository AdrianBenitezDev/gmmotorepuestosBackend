import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { actualizarBooleanStock } from "./config.js";
import { spiner } from "./spin.js";

const auth = getAuth();

document.getElementById("btnStock").addEventListener('click',()=>{

    actualizarBooleanStock(true);

    
    document.getElementById("ventasOnline").style.display="none";
    document.getElementById("container").style.display="flex";
    document.getElementById("container").innerHTML=``;
    document.getElementById("divBusquedaInicio").style.display="flex";
    document.getElementById("busquedaProductosInicioTBody").innerHTML="";

    
    document.getElementById("busquedaProductosInicio").style.display="flex";

    document.getElementById("categorias").selectedIndex=0;

    
  document.getElementById("flyerDiv").style.display="none";

  document.getElementById("inputBusquedaInicio").focus();

    
})


export async function actualizarStock(idDoc,stockJson,precioJson,proveedorJson){
  //tomamos el valor actul

  let newStock=document.getElementById("stock_"+idDoc).value;

  let newPrecio=document.getElementById("precio_"+idDoc).value;

  let newProveedor=document.getElementById("proveedor_"+idDoc).value;

  // console.log(stockJson)
  
  // console.log(newStock)

  if(stockJson==newStock && precioJson == newPrecio && proveedorJson == newProveedor){
    alert("❌ Error: No hay datos nuevos para actualizar!!")
    return
  }

  const stock = Number(newStock);
  const precio = Number(newPrecio);
  const proveedor = Number(newProveedor)

  if (Number.isNaN(stock)) {
    return;
  }
   if (Number.isNaN(precio)) {
    return;
  }

   if (Number.isNaN(proveedor)) {
    return;
  }

//realizamos el fetch
  if (!Number.isInteger(stock)) {
  return;
 }
   if (!Number.isInteger(precio)) {
  return;
 }

 if (!Number.isInteger(proveedor)) {
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
      proveedor:proveedor,
      precio:precio,
      id:idDoc
    }
 
 let resp=await fetch("https://actualizarProducto-xhlrljateq-uc.a.run.app", {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`
   },
   body: JSON.stringify(newStockAndPrecio)
 });
 
 console.log(resp.json())
 
   spiner(false);
   alert("✅ Stock y Precio Actualizado Correctmente")
   //recargamos la pagina
   //location.reload();
 
 } catch (e) {
    spiner(false);
    alert("❌ Error al intentar Actualizar el Stock y Precio")
   console.log("this error")
   console.error(e);
  
   return;
 }


}
