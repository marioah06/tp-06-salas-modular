const { PORT, NODE_ENV } = require("./configuracion");
const crearApp = require("./app");

const app = crearApp();

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT} [Ambiente: ${NODE_ENV}]`,
  );
});
