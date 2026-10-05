# Trabajo práctico 06

## Proyecto de partida y cambios
El proyecto parte de una estructura monolítica previa del TP 05 en la cual toda la lógica se organizaba en un único archivo. Se realizó una refactorización completa hacia una **arquitectura modular de 8 archivos** dentro del directorio `src/`, separando responsabilidades en capas (configuración, servicios, controladores, rutas y middlewares).

## Instalación y ejecución
Para poner en marcha el proyecto localmente, se ejecutaron los siguientes comandos en la terminal:
- `npm install`: Instalación de dependencias del proyecto (Express, EJS, Morgan, ESLint, Prettier), finalizando con un entorno limpio y sin vulnerabilidades (`found 0 vulnerabilities`).
- `npm start`: Arranque del servidor ejecutando `node src/index.js`, el cual levanta la aplicación en `http://localhost:3000`.

## Configuración del entorno
La configuración se centraliza en `src/configuracion.js`, encargada de gestionar y validar las variables de entorno principales como el puerto de escucha (`PORT`) y el entorno de ejecución (`NODE_ENV`), utilizando valores por defecto seguros para desarrollo.

## Mapa de módulos y dependencias
El sistema se organiza en módulos interconectados bajo `src/`:
- `index.js`: Punto de entrada que inicializa la configuración y arranca el servidor.
- `app.js`: Configura Express, motor de vistas EJS, archivos estáticos y middlewares globales.
- `servicios/reservas.js`: Contiene la lógica de negocio y el almacenamiento en memoria.
- `controladores/reservas.js`: Gestiona las peticiones HTTP y la interacción con las vistas.
- `rutas/reservas.js`: Define el enrutador específico montado bajo el prefijo `/reservas`.
- `middleware/`: Contiene los validadores de formularios, inyección de secciones, identificador único de solicitud y medidor de duración.

## Pipeline y contrato de rutas
El pipeline de Express procesa las peticiones globales mediante Morgan (logueo), generación de ID de solicitud (`X-Request-ID`) y medición de tiempos mediante el evento `finish`. El contrato de rutas incluye:
- `GET /`: Vista de bienvenida.
- `GET /estado`: Estado del servicio en formato JSON.
- `GET /reservas`: Listado de reservas.
- `GET /reservas/:id`: Detalle de una reserva específica.
- `POST /reservas`: Creación de una reserva previa validación estricta de campos.

## Matriz antes/después
- **Antes (TP 05):** Código monolítico en un único archivo, propenso a errores, difícil de escalar y sin herramientas automáticas de validación de estilo.
- **Después (TP 06):** Arquitectura modular limpia, separación estricta de capas, código formateado y validado estáticamente de forma automática.

## Formato y análisis estático
Se implementaron y ejecutaron herramientas de calidad de código:
- `npm run format`: Ejecuta Prettier para dar formato automático a todo el código fuente en `src/`.
- `npm run check` (compuesto por `format:check` y `lint`): Valida las reglas de estilo de Prettier y ejecuta ESLint para el análisis estático, arrojando cero errores.

## Persistencia temporal y límites
Las reservas se almacenan en un arreglo en memoria RAM dentro de la capa de servicios. Al tratarse de persistencia temporal, **cualquier modificación o creación de datos se perderá al reiniciar el servidor**, volviendo al estado inicial definido en el arreglo.

Por qué el servicio no usa res:
El servicio (src/servicios/reservas.js) se encarga exclusivamente de la lógica de negocio y del manejo de los datos. No debe conocer ni manipular objetos HTTP como req (request) o res (response), ya que esa es una responsabilidad exclusiva de la capa de control. El servicio solo recibe datos puros, realiza operaciones (filtrar, buscar, crear) y retorna valores o arreglos, lo que hace que el código sea reutilizable y fácil de probar de forma aislada.

Qué hace el controlador:
El controlador (src/controladores/reservas.js) actúa como intermediario entre las peticiones HTTP y la lógica de negocio. Recibe los objetos req y res, extrae los parámetros o datos enviados por el cliente, invoca a las funciones correspondientes del servicio de reservas, y finalmente decide cómo responder (renderizando una vista EJS, enviando un JSON o realizando una redirección HTTP).

Por qué el router declara caminos relativos:
El enrutador (src/rutas/reservas.js) declara rutas relativas (como "/" o "/:id") porque está diseñado para ser modular. Al montarse en la aplicación principal (app.js) bajo un prefijo común (app.use("/reservas", rutasReservas)), todas sus rutas internas se concatenan automáticamente a ese prefijo. Esto permite que el módulo sea independiente y pueda trasladarse o escalarse fácilmente sin hardcodear rutas absolutas.

Dónde vive el único arreglo de reservas y qué ocurrirá con él al reiniciar:
El único arreglo de reservas vive en la memoria RAM del servidor, específicamente dentro del archivo del servicio (src/servicios/reservas.js). Al tratarse de persistencia temporal en memoria, cualquier modificación (creación de una nueva reserva) se perderá y el arreglo volverá a su estado inicial cada vez que el servidor se reinicie (por ejemplo, al detener el proceso con Ctrl + C o al reiniciar Nodemon).

Comandos ejecutados y sus resultados:

npm install: Instaló las 190 dependencias del proyecto de forma limpia y sin vulnerabilidades (found 0 vulnerabilities).

npm start: Puso en marcha el servidor Node.js ejecutando src/index.js, dejándolo activo en http://localhost:3000 en entorno de desarrollo.

npm run format: Ejecutó Prettier para formatear y estilar automáticamente todos los archivos dentro de la carpeta src/.

npm run check (compuesto por format:check y lint): Verificó que el código cumpliera estrictamente con el estilo de Prettier y pasó el análisis estático de ESLint sin errores ni advertencias.