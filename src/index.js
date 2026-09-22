const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(morgan("dev"));

let contadorSolicitudes = 1;
const identificarSolicitud = (req, res, next) => {
 const idNum = String(contadorSolicitudes++).padStart(4, '0');
 res.locals.solicitudId = `BIB-${idNum}`;
 next();
};
app.use(identificarSolicitud);


const medirDuracion = (req, res, next) => {
 const inicio = Date.now();
 res.on('finish', () => {
 const duracion = Date.now() - inicio;
 console.log(`[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duración: ${duracion}ms`);
 });
next();
};
app.use(medirDuracion);
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

let reservas = [
{ id: 1, estudiante: "Ana Pérez", email: "ana.perez@val.edu", sala: "Sala Norte", fecha: "2026-06-01", turno: "Mañana", personas: 3 },
{ id: 2, estudiante: "Carlos Gómez", email: "carlos@val.edu", sala: "Sala Sur", fecha: "2026-06-01", turno: "Tarde", personas: 2 },
{ id: 3, estudiante: "Lucía Fernández", email: "lucia@val.edu", sala: "Sala Multimedia", fecha: "2026-06-02", turno: "Noche", personas: 5 },
{ id: 4, estudiante: "Mateo Ruiz", email: "mateo@val.edu", sala: "Sala Norte", fecha: "2026-06-03", turno: "Mañana", personas: 4 }
];

app.get('/', (req, res) => {
res.render('inicio', { titulo: 'Inicio - Reservas de Salas' });
});

app.get('/estado', (req, res) => {
 res.json({
 servicio: "activo",
 reservas: reservas.length,
 solicitudId: res.locals.solicitudId
 });
});

const reservasRouter = express.Router();
reservasRouter.use((req, res, next) => {
res.locals.seccion = "Reservas de salas";
next();
});


const validarReserva = (req, res, next) => {
let { estudiante, email, sala, fecha, turno, personas } = req.body;


estudiante = estudiante ? estudiante.trim() : "";
email = email ? email.trim() : "";
sala = sala ? sala.trim() : "";
fecha = fecha ? fecha.trim() : "";
turno = turno ? turno.trim() : "";

const personasNum = Number(personas);
  
const emailValido = email.includes('@');
const personasValidas = Number.isInteger(personasNum) && personasNum >= 1 && personasNum <= 6;
const salaValida = salasPermitidas.includes(sala);
const turnoValido = turnosPermitidos.includes(turno);

if (!estudiante || !email || !emailValido || !sala || !salaValida || !fecha || !turno || !turnoValido || !personasValidas) {
 return res.status(400).render('reservas/nueva', {
  titulo: 'Nueva Reserva',
  error: 'Por favor, complete todos los campos correctamente. Verifique que el email contenga "@", la sala y turno sean válidos, y la cantidad de personas sea de 1 a 6.',
  datos: req.body
    });
    }

  req.reservaValidada = {
  estudiante,
  email,
  sala,
  fecha,
  turno,
  personas: personasNum
};
next();
};


reservasRouter.get('/', (req, res) => {
res.render('reservas/lista', { titulo: 'Listado de Reservas', reservas });
});

reservasRouter.get('/nueva', (req, res) => {
 res.render('reservas/nueva', { titulo: 'Nueva Reserva', error: null, datos: {} });
});


reservasRouter.get('/:id', (req, res) => {
 const id = parseInt(req.params.id);
 const reserva = reservas.find(r => r.id === id);

 if (!reserva) {
 return res.status(404).render('no-encontrado', {
 titulo: 'No encontrado',
 mensaje: 'La reserva solicitada no existe.'
  });
 }

  res.render('reservas/detalle', { titulo: `Detalle de Reserva #${reserva.id}`, reserva });
});

reservasRouter.post('/', validarReserva, (req, res) => {
const nuevaReserva = {
id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
...req.reservaValidada
};

reservas.push(nuevaReserva);
res.redirect('/reservas');
});


app.use('/reservas', reservasRouter);


app.use((req, res) => {
res.status(404).render("no-encontrado", {
titulo: "Página no encontrada",
mensaje: "La dirección solicitada no existe."
 });
});


app.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});