function agregarSeccion(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const { sala, usuario, fecha, hora } = req.body;

  if (!sala || !usuario || !fecha || !hora) {
    return res.status(400).render("error", {
      mensaje:
        "Todos los campos (sala, usuario, fecha, hora) son obligatorios.",
    });
  }

  next();
}

module.exports = {
  agregarSeccion,
  validarReserva,
};
