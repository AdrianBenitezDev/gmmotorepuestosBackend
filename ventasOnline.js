import {traerVentas}  from "/onSnapshot.js"

document.getElementById("btnVentasOnline").addEventListener('click',()=>{

    document.getElementById("ventasOnline").style.display="flex";
    
    document.getElementById("container").style.display="none";

    document.getElementById("divBusquedaInicio").style.display="none"

    traerVentas();
})


