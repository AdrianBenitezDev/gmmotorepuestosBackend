export let jsonActual={}

export function setValorJsonActual(valor){

  jsonActual=valor;
  console.log("se acutualizo el valor de json actual")
  console.log(jsonActual)

}



// js/config.js
window.APP_CONFIG = {
  owner: "AdrianBenitezDev",
  repo: "gmmotorepuestosBackend",
  categoriasTextos : [
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
};



