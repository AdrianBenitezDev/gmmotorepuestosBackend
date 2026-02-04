export let jsonActual={}

export function setValorJsonActual(valor){

  jsonActual=valor;
  console.log("se acutualizo el valor de json actual")
  console.log(jsonActual)

}

export let booleanStock = false;

export function actualizarBooleanStock(valor){
  booleanStock=valor
}

// js/config.js

  export let owner= "AdrianBenitezDev";
  export let repo= "gmmotorepuestosBackend";
  export let categoriasTextos = [
  "Seleccione una categoria",
  "motor",
  "transmision",
  "frenos",
  "electricidad e iluminación",
  "suspension",
  "cubiertas y llantas",
  "escapes",
  "carroceria y plasticos",
  "accesorios",
  "mantenimiento"
]



