function agregarSeccion(req, res, next) {
  res.locals.seccion = "Reservas de Salas";
  next();
}

function validarReserva(req, res, next) {
  const { estudiante, email, sala, fecha, turno, personas } = req.body;
  const errores = [];


  if (!estudiante || typeof estudiante !== "string" || estudiante.trim() === "") {
    errores.push("El nombre del estudiante es obligatorio.");
  }

  if (!email || !email.includes("@")) {
    errores.push("Debe ingresar un correo electrónico válido que contenga '@'.");
  }

  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  if (!salasPermitidas.includes(sala)) {
    errores.push("Debe seleccionar una sala válida.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }

  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
  if (!turnosPermitidos.includes(turno)) {
    errores.push("Debe seleccionar un turno válido.");
  }

  const numPersonas = Number(personas);
  if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
    errores.push("La cantidad de personas debe ser un número entero entre 1 y 6.");
  }

  
  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: errores.join(" "),
      datos: req.body, 
    });
  }

 
  req.reservaValidada = {
    estudiante: estudiante.trim(),
    email: email.trim(),
    sala,
    fecha,
    turno,
    personas: numPersonas,
  };

  next();
}

module.exports = {
  agregarSeccion,
  validarReserva,
};