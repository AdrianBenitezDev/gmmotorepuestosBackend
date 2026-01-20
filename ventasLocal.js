document.getElementById("btnVentasLocal").addEventListener('click',()=>{
    
    booleanStock=false;

    document.getElementById("titleStockAndVentaLocal").textContent="Venta en el Local";
    
    document.getElementById("ventasOnline").style.display="none";
    document.getElementById("container").style.display="flex";
    document.getElementById("container").innerHTML=``;
    document.getElementById("divBusquedaInicio").style.display="flex";
    
    document.getElementById("busquedaProductosInicio").innerHTML="";

    document.getElementById("categorias").selectedIndex=0;
})