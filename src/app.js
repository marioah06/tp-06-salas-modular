const express = require("express");
const path = require("path");
const morgan = require("morgan");
const {
  generarIdSolicitud,
  medidorDuracion,
} = require("./middleware/solicitudes");
const { agregarSeccion } = require("./middleware/reservas");
const rutasReservas = require("./rutas/reservas");

function crearApp() {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));

  app.use(morgan("dev"));
  app.use(generarIdSolicitud);
  app.use(medidorDuracion);
  app.use(agregarSeccion);

  app.use(express.static(path.join(__dirname, "../public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", {
      mensaje: "Bienvenido al sistema de reservas de salas",
    });
  });

  app.get("/estado", (req, res) => {
    res.json({
      estado: "OK",
      idSolicitud: req.idSolicitud,
      timestamp: new Date(),
    });
  });

  app.use("/reservas", rutasReservas);

  app.use((req, res) => {
    res
      .status(404)
      .render("no-encontrado", { mensaje: "Página no encontrada (404)" });
  });

  return app;
}

module.exports = crearApp;
