const nodeEnv = process.env.NODE_ENV || "development";

let port = 3000;
if (process.env.PORT) {
  const parsedPort = Number(process.env.PORT);
  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    console.error(`Error: El puerto configurado (${process.env.PORT}) es inválido. Debe ser un número entero entre 1 y 65535.`);
    process.exit(1);
  }
  port = parsedPort;
}

module.exports = {
  port,
  nodeEnv,
};