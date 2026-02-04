// auth.js
import { getAuth, signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { app } from "./firebaseConfig.js";

export const auth = getAuth(app);

// ejemplo login
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}
