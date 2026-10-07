const { port, nodeEnv } = require("./configuracion");
const app = require("./app");

app.listen(port, () => {
  console.log(
    `Servidor corriendo en http://localhost:${port} [Ambiente: ${nodeEnv}]`
  );
});
