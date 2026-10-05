const servicioReservas = require("../servicios/reservas");

function mostrarListado(req, res) {
  const reservas = servicioReservas.listarReservas();
  const total = servicioReservas.contarReservas();
  res.render("reservas/listado", { reservas, total });
}

function mostrarDetalle(req, res) {
  const { id } = req.params;
  const reserva = servicioReservas.buscarReservaPorId(id);

  if (!reserva) {
    return res
      .status(404)
      .render("no-encontrado", { mensaje: "Reserva no encontrada" });
  }

  res.render("reservas/detalle", { reserva });
}

function crearNuevaReserva(req, res) {
  const { sala, usuario, fecha, hora } = req.body;

  servicioReservas.crearReserva({
    sala,
    usuario,
    fecha,
    hora,
  });

  res.redirect("/reservas");
}

module.exports = {
  mostrarListado,
  mostrarDetalle,
  crearNuevaReserva,
};
