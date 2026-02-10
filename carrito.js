//window.onload = traerCategorias();
let datos=JSON.parse(localStorage.getItem('datos'));
let user=datos?.usuario||"ADMINISTRADOR_"+Math.random(4);
let arrayPedido=datos?.carrito||[];

//variable global del total de los productos vendidos en el local
let total=0;

if(arrayPedido.length>0){
  
  document.getElementById("contadorCarrito").textContent = arrayPedido.length;
  mostrarMensaje("⚠️ Hay Productos en el Carrito!")

}


//necesito que se ingrese:

//0 categoria
//1 id producto
//2 nombre del producto
//3 precio
//4 canatidad del producto comprados

// arrayPedido[0]
// arrayPedido[1]
// arrayPedido[2]
// arrayPedido[3]
// arrayPedido[4]  Cantidad de la Compras 


function mostrarMensaje(mensaje) {
  const containerMensaje = document.getElementById("mensaje");

  let divMensaje = document.createElement('div');
  divMensaje.classList.add('mensaje');

  let texto = document.createElement("p");
  texto.textContent = mensaje;

  divMensaje.appendChild(texto);
  containerMensaje.appendChild(divMensaje);

  // FORZAR un frame para que la transición funcione
  requestAnimationFrame(() => {
    divMensaje.classList.add("show");
  });

  // Visible 3 segundos
  setTimeout(() => {
    divMensaje.classList.remove("show");

    // Esperar que termine la animación antes de eliminar
    setTimeout(() => {
      containerMensaje.removeChild(divMensaje);
    }, 500); // mismo tiempo que la transición
  }, 3000);
}



//Agregar al carrito
function addProduct(pro) {

  
mostrarMensaje("✅ Producto Agregado!");


  let existe = arrayPedido.find(ele => ele[0] == pro[0]);

  if (existe) {
    // Si existe, sumo cantidad
    existe[4] += 1;

  } else {
    // Si no existe, agrego uno nuevo
    arrayPedido.push(pro);
  }

  document.getElementById("contadorCarrito").textContent = arrayPedido.length;

  //guardamos en local storage
let datosGuardarLocalStorage={usuario:user,carrito:arrayPedido};

  localStorage.setItem('datos',JSON.stringify(datosGuardarLocalStorage))
  console.log("datos guardados en ls: ")
  console.log(datosGuardarLocalStorage)
}


function irDivBuscar(){
  document.getElementById("DivSeach").scrollIntoView({
    behavior: "smooth"
  });
}

function verPedidos(){
if(arrayPedido.length>0){

  
  document.getElementById("panelBlack").style.display="flex";

  let row="";
  //limpiamos el valor del total
    total=0;
  arrayPedido.forEach((pedido,index)=>{

  row+=`
          <tr>
            <td><button onclick="menos(${index})" >-</button> ${pedido[4]} <button onclick="mas(${index})">+</button></td>
           
            <td class=""><img class="imgPanelPedidos" src="${pedido[5]}"></td> 
             <td class="product-name">${pedido[2]}</td>
            <td class="product-price">$${pedido[3]}</td>
            <td class=""><button onclick="dele(${index})">Borrar</button></td>
          </tr>
  `;



  total += Number(pedido[3]) * Number(pedido[4]);


  })

  document.getElementById("rowTabla").innerHTML=row;
    document.getElementById("Total").innerHTML="$ "+total;


}else{
alert("no selecciono ningún producto!")
}
}

function cerrarPanelPedidos(){
  document.getElementById("panelBlack").style.display="none";
}



function menos(id){

if(arrayPedido.length>0 && arrayPedido[id][4]>1){
arrayPedido[id][4]=Number(arrayPedido[id][4])-1;

verPedidos();
}

}
function mas(id){
 
 
arrayPedido[id][4]=Number(arrayPedido[id][4])+1;

verPedidos();
 
}

function dele(id){

if(arrayPedido[id][4]&&arrayPedido.length>1){
 arrayPedido.splice(id, 1);
  document.getElementById("contadorCarrito").textContent = arrayPedido.length;

  
  //guardamos en local storage
let datosGuardarLocalStorage={usuario:user,carrito:arrayPedido};

  localStorage.setItem('datos',JSON.stringify(datosGuardarLocalStorage))
  console.log("datos guardados en ls: ")
  console.log(datosGuardarLocalStorage)

verPedidos();

}else{
  arrayPedido.splice(id, 1);
  document.getElementById("rowTabla").innerHTML="<td></td><td><p>La lista de Pedidos esta Vacia</p></td><td></td><td></td><td></td>"
   document.getElementById("contadorCarrito").textContent = "0";
   document.getElementById("Total").innerHTML="$ 0";

   
  //guardamos en local storage
let datosGuardarLocalStorage={usuario:user,carrito:arrayPedido};

  localStorage.setItem('datos',JSON.stringify(datosGuardarLocalStorage))
  console.log("datos guardados en ls: ")
  console.log(datosGuardarLocalStorage)

}
}


async function comprarProducto(id,categoria,cantidad){

    spinTrue()
    mostrarMensaje("Preparando la compra");

  console.log("comprando..");
  let array={
      envio:false,
      carrito:false,
      cantidad:cantidad,
      arrayCarrito:[],
      cantidad:cantidadActual,
      producto:{id:id,categoria:categoria},
      metodo_pago: "local", //puede ser online
  }

  let resp =await fetch("https://crearVentaPendiente-xhlrljateq-uc.a.run.app", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(array)
})


  let res=await resp.json();
  console.log(res)

  if(res.ok==true){
mostrarMensaje("✅ Compra Realizada");
}else{
mostrarMensaje("❌ Error al realizar la compra");
}



  spinFalse()
}




async function terminarVenta(){


  alert("venta en el local terminada, debe abonar "+total);

  //actualizamos el valor del carrito
  arrayPedido=[];
let datosGuardarLocalStorage={usuario:user,carrito:arrayPedido};
  localStorage.setItem('datos',JSON.stringify(datosGuardarLocalStorage))

  
  document.getElementById("contadorCarrito").textContent = arrayPedido.length;
  //document.getElementById("panelBlack").style.display="none";
  verPedidos();

  


  return
  spinTrue()

  let datos={
      
      envio:false,
      carrito:true,
      arrayCarrito:arrayPedido,
      producto:{},
      metodo_pago: "local",//puede ser online
      
  }
  
  console.log("datos enviados carrito:")
  console.log(datos)

  //obtenemos el array de productos y lo enviamos al backend

  let resp =await fetch("https://us-central1-gmmotorepuestos-ventas.cloudfunctions.net/crearVentaPendiente", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos)
})
 let res=await resp.json();
  console.log(res)

if(res.ok==true){
mostrarMensaje("✅ Compra Realizada");
}else{
mostrarMensaje("❌ Error al realizar la compra");
}

 

  spinFalse()
  cerrarPanelPedidos()
    


}