const servicioReservas = require("../servicios/reservas");

function mostrarListado(req, res) {
  const reservas = servicioReservas.listarReservas();
  const total = servicioReservas.contarReservas();

  res.render("reservas/lista", { titulo: "Listado de Reservas", reservas, total });
}

function mostrarFormularioAlta(req, res) {
  res.render("reservas/nueva", { 
    titulo: "Nueva Reserva",
    error: null, 
    datos: {} 
  });
}

function mostrarDetalle(req, res) {
  const { id } = req.params;
  const reserva = servicioReservas.buscarReservaPorId(id);

  if (!reserva) {
    return res
      .status(404)
      .render("no-encontrado", { titulo: "No encontrada" });
  }

  res.render("reservas/detalle", { titulo: "Detalle de Reserva", reserva });
}

function obtenerEstado(req, res) {
  const cantidad = servicioReservas.contarReservas();
  res.json({ cantidad });
}

function crearNuevaReserva(req, res) {
  const datosReserva = req.reservaValidada || {
    estudiante: req.body.estudiante,
    email: req.body.email,
    sala: req.body.sala,
    fecha: req.body.fecha,
    turno: req.body.turno,
    personas: req.body.personas,
  };

  servicioReservas.crearReserva(datosReserva);

  res.redirect("/reservas");
}

module.exports = {
  mostrarListado,
  mostrarFormularioAlta,
  mostrarDetalle,
  obtenerEstado,
  crearNuevaReserva,
};