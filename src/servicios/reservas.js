let reservas = [
  {
    id: 1,
    estudiante: "Juan Pérez",
    email: "juan.perez@example.com",
    sala: "Sala A",
    fecha: "2026-06-01",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "María Gómez",
    email: "maria.gomez@example.com",
    sala: "Sala B",
    fecha: "2026-06-02",
    turno: "Tarde",
    personas: 4,
  },
];

function listarReservas() {
  return reservas;
}

function buscarReservaPorId(id) {
  return reservas.find((r) => r.id === Number(id));
}

function contarReservas() {
  return reservas.length;
}

function crearReserva(nuevaData) {
  const nuevaReserva = {
    id: reservas.length > 0 ? reservas[reservas.length - 1].id + 1 : 1,
    ...nuevaData,
  };
  reservas.push(nuevaReserva);
  return nuevaReserva;
}

module.exports = {
  listarReservas,
  buscarReservaPorId,
  contarReservas,
  crearReserva,
};