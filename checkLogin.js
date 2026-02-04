import {app} from "./firebaseConfig.js"

import { getAuth, onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // ❌ no logeado
    window.location.href = "/index.html";
    return;
  }

  const token = await user.getIdTokenResult();

  if (!token.claims.admin) {
    // ❌ no admin
    window.location.href = "/index.html";
    return;
  }

  // ✅ usuario admin autenticado
  console.log("Admin OK");
});
