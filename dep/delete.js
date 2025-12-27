


async function deleteProducto(categoria,id,nombre){
  let eliminar=confirm("desea eliminar el producto seleccionado? "+nombre)

  if(eliminar){
    //preparamos el body
    let json={deleteCategoria:categoria,deleteId:id}

    //realizamos un fetch post al backend donde transmitimos categoria y id del producto a eliminar
    
      //para producción
  let urlExcel="https://script.google.com/macros/s/AKfycbx-YwE7fkQKIyiQV13JPs0iIxRWw-nohtciTnR0Gb2G_ef6qtWSHSDEro_ipWeiBnTtKg/exec";
   console.log(urlExcel)

  try {
  resp = await fetch(urlExcel,{
  method: "POST", headers: {
    "Content-Type": "text/plain"  // 👈 TRUCO CLAVE: NO HAY OPTIONS
  },
  body: JSON.stringify(json)
})
 const texto = await resp.text(); // <-- aquí está la respuesta REAL
 // console.log("Respuesta del backend:", texto);

  spinFalse();

}catch{

}




    alert("se elimino el producto "+nombre)


    cargarProductos(valorActualOption)
  }else{
 alert("proceso cancelado")
  }

}
