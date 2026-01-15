

const contenedor=document.getElementById("container");

document.getElementById("btnStock").addEventListener('click',()=>{

        document.getElementById("ventasOnline").style.display="none";
    
    document.getElementById("container").style.display="flex";

    divStock();

})

function divStock(){
    let h3=document.createElement("h3");
    h3.textContent="Stock";
    contenedor.append(h3)
}