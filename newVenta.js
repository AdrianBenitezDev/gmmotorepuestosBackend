let cargando = true;

onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added" && !cargando) {
      alert("🛒 Nueva venta recibida");
    }
  });

  cargando = false;
});
