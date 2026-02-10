
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "../firebaseConfig.js";
import { spiner } from "../spin.js";

const auth = getAuth(app);

window.logear = async function () {
  const email = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  spiner(true);

  try {
    // 1️⃣ login Firebase
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    // 2️⃣ validar admin en backend
    const resp = await fetch(
      "https://loginAdmin-xhlrljateq-uc.a.run.app",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      }
    );

    const data = await resp.json();

    if (data.ok && data.admin) {
     window.location.href = "/admin.html";
    } else {
      alert("No sos admin");
    }

  } catch (err) {
    console.error(err);
    alert("Credenciales incorrectas");
  } finally {
    spiner(false);
  }
}

