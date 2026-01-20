document.getElementById("btnStock").addEventListener('click',()=>{

    booleanStock=true;

    document.getElementById("titleStockAndVentaLocal").textContent="Stock";
    
    document.getElementById("ventasOnline").style.display="none";
    document.getElementById("container").style.display="flex";
    document.getElementById("container").innerHTML=``;
    document.getElementById("divBusquedaInicio").style.display="flex";
    document.getElementById("busquedaProductosInicio").innerHTML="";

    document.getElementById("categorias").selectedIndex=0;

    
})