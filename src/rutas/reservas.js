const express = require("express");
const router = express.Router();
const controladorReservas = require("../controladores/reservas");
const { validarReserva } = require("../middleware/reservas");

router.get("/", controladorReservas.mostrarListado);
router.get("/:id", controladorReservas.mostrarDetalle);
router.post("/", validarReserva, controladorReservas.crearNuevaReserva);
module.exports = router;
