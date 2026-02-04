import { spiner } from "../spin.js";
import {cargarProductos, valorActualOption, setValorActualOption} from "./generarCardProductos.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

export async function deleteProducto(deleteId,nombre){
  let eliminar=confirm("desea eliminar el producto seleccionado? "+nombre)

  if(eliminar){
    spiner(true)
    //preparamos el body
    let jsonDelete={id:deleteId}
    console.log(jsonDelete);

    
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
    
   let resp= await fetch("https://us-central1-gmmotorepuestos-ventas.cloudfunctions.net/deleteProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(jsonDelete)
    });
    
    console.log("respuesta al eliminar producto:")
    console.log(resp.json())
      spiner(false);
    } catch (e) {
       spiner(false);
      console.log("this error")
      console.error(e);
     
      return;
    }

    //fin del FETCH

    alert("se elimino el producto "+nombre)

    cargarProductos(valorActualOption)
  }else{
 alert("proceso cancelado")
  }

}
