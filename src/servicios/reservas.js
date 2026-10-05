let reservas = [
  {
    id: 1,
    sala: "Sala A",
    usuario: "Juan Pérez",
    fecha: "2026-06-01",
    hora: "10:00",
  },
  {
    id: 2,
    sala: "Sala B",
    usuario: "María Gómez",
    fecha: "2026-06-02",
    hora: "14:00",
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
