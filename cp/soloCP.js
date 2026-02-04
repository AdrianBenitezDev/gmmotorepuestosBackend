
// ====== LISTENERS INPUTS ======
function colocarListenerVP(){

  const inputPrecio = document.getElementById("inputPrecio");
  if(inputPrecio) inputPrecio.onkeyup = () => document.getElementById("precioVP").textContent = "$ "+inputPrecio.value;

  const tituloP = document.getElementById("tituloP");
  if(tituloP) tituloP.onkeyup = () => document.getElementById("tituloVP").textContent = tituloP.value;

  const stockP = document.getElementById("stockP");
  if(stockP) stockP.onkeyup = () => {
    
      let valorStock=stockP.value;
    if(valorStock==0){
      document.getElementById("labelStockId").style.display="flex";
    }else{
      document.getElementById("labelStockId").style.display="none";
    }

    document.getElementById("stockVP").textContent = "Stock "+stockP.value;}

  const descripcionP = document.getElementById("descripcionP");
  if(descripcionP) descripcionP.onkeyup = () => document.getElementById("descripcionVP").textContent = descripcionP.value;

  
//agregamos el listener para que verifique si los campos y las imagenes estan vacias

document.addEventListener("input", validarFormulario);
document.addEventListener("change", validarFormulario);

function validarFormulario() {
  const precioOk = inputPrecio.value.trim() !== '';
  const tituloOk = tituloP.value.trim() !== '';
  const descripcionOk = descripcionP.value.trim() !== '';
  const imagenesOk = arrayImgSeleccionadas.length > 0;

  if (precioOk && tituloOk && descripcionOk && imagenesOk) {
    btn.className = 'btnCrearProducto';
    btn.disabled = false;
    console.log("✅ btn habilitado");
  } else {
    btn.className = 'btnCrearProducto btnDisabled';
    btn.disabled = true;
    console.log("❌ btn deshabilitado");
  }
}


}

colocarListenerVP()