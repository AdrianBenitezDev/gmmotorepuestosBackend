import { dbProducto } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
    limit,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function busquedaPalabra(textoInput){

    
const palabras = generarKeywords(textoInput);

    // hacemos la query con la PRIMER palabra
const q = query(
  collection(dbProducto, "productos"),
  where("producto_keywords", "array-contains", palabras[0]),
  limit(20)
);

const snap = await getDocs(q);

// filtramos en frontend
const resultados = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(p =>
    palabras.every(pal =>
      p.producto_keywords.includes(pal)
    )
  );

  console.log(resultados)

    return resultados
}



export function generarKeywords(texto) {

  if (!texto) return [];

  return texto
    .toLowerCase()
    .normalize("NFD")                // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")     // limpia símbolos
    .split(" ")
    .filter(p => p.length > 2);      // opcional: evita "de", "la", etc.
}
