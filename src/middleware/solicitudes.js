function generarIdSolicitud(req, res, next) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  req.idSolicitud = `BIB-${randomNum}`;
  res.setHeader("X-Request-ID", req.idSolicitud);
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(inicio);
    const duracionMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    console.H?.(
      `[${req.idSolicitud}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duracionMs} ms)`,
    );
  });

  next();
}

module.exports = {
  generarIdSolicitud,
  medidorDuracion: medirDuracion,
};
