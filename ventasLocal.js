import { actualizarBooleanStock } from "./config.js";

document.getElementById("btnVentasLocal").addEventListener('click',()=>{
    
    actualizarBooleanStock(false);

    
    document.getElementById("ventasOnline").style.display="none";
    document.getElementById("container").style.display="flex";
    document.getElementById("container").innerHTML=``;
    document.getElementById("divBusquedaInicio").style.display="flex";
    
    document.getElementById("busquedaProductosInicioTBody").innerHTML="";

    
    document.getElementById("busquedaProductosInicio").style.display="flex";

  document.getElementById("flyerDiv").style.display="none";

    document.getElementById("categorias").selectedIndex=0;
    
  document.getElementById("inputBusquedaInicio").focus();
})


export function compartirProducto(idDoc) {
  const urlCopy = `https://www.gmmotorepuestos.com.ar/?id=${idDoc}`;

  navigator.clipboard.writeText(urlCopy)
    .then(() => {
      alert("Link copiado al portapapeles 📋");
    })
    .catch(err => {
      console.error("No se pudo copiar", err);
    });
}
