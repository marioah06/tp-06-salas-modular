let contadorBib = 1;

function identificarSolicitud(req, res, next) {
  const solicitudId = `BIB-${String(contadorBib++).padStart(3, "0")}`;
  res.locals.solicitudId = solicitudId;
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime();

  res.on("finish", () => {
    const [segundos, nanosegundos] = process.hrtime(inicio);
    const duracionMs = (segundos * 1000 + nanosegundos / 1e6).toFixed(2);
    const solicitudId = res.locals.solicitudId || "N/A";

    console.log(
      `[${solicitudId}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duración: ${duracionMs}ms`
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};