# Trabajo práctico 05

## Descripción
Aplicación web desarrollada en Node.js con Express y EJS para la gestión y consulta de reservas en salas de estudio. El proyecto implementa un pipeline de middlewares globales, de router y de validación, cumpliendo con el almacenamiento en memoria y control de solicitudes.

## Instalación
Clonar el repositorio e instalar las dependencias ejecutando:
\`\`\`bash
npm install
\`\`\`

## Ejecución
Iniciar la aplicación en modo de producción ejecutando:
\`\`\`bash
npm start
\`\`\`
O verificar la sintaxis con:
\`\`\`bash
npm run check
\`\`\`

## Rutas
- `GET /` : Página de inicio del sistema.
- `GET /estado` : Devuelve el estado actual del servicio en formato JSON (cantidad de reservas e ID de solicitud).
- `GET /reservas` : Listado general de todas las reservas de salas.
- `GET /reservas/nueva` : Formulario para registrar una nueva reserva.
- `GET /reservas/:id` : Detalle de una reserva específica buscada por ID.
- `POST /reservas` : Procesa y valida los datos del formulario para dar de alta una nueva reserva.

## Pipeline de middleware
El pipeline global respeta el siguiente orden de ejecución:
1. `morgan("dev")`
2. `identificarSolicitud`
3. `medirDuracion`
4. `expressLayouts`
5. `express.static`
6. `express.urlencoded` / `express.json`
7. Rutas de aplicación y router de reservas (`/reservas`)
8. Página 404 (middleware final)

### Diagrama del POST Válido
\`\`\`text
POST /reservas
  ↓ morgan("dev")
  ↓ identificarSolicitud
  ↓ medirDuracion
  ↓ expressLayouts
  ↓ express.urlencoded
  ↓ reservasRouter
  ↓ prepararAreaReservas (middleware de área)
  ↓ validarReserva
  ↓ crearReserva (handler final)
  ↓ 302 /reservas (redirección)
  ↓ finish: ID + estado + duración
\`\`\`

### Diagrama del POST Inválido
\`\`\`text
POST /reservas
  ↓ morgan("dev")
  ↓ identificarSolicitud
  ↓ medirDuracion
  ↓ expressLayouts
  ↓ express.urlencoded
  ↓ reservasRouter
  ↓ prepararAreaReservas
  ↓ validarReserva (falla la validación)
  ↓ status 400 y render de 'reservas/nueva' (fin del ciclo)
\`\`\`

## Alcance de cada función
- **Globales:** Se aplican a absolutamente todas las peticiones que llegan al servidor (ej. Morgan, identificador, medición).
- **De router / área:** Se aplican únicamente a un grupo de rutas específicas agrupadas bajo un router montado (ej. el prefijo `/reservas`).
- **De ruta / handler:** Se ejecutan de manera puntual para una ruta o método HTTP en particular (ej. validación previa al POST o creación final).

## Validación
El middleware `validarReserva` normaliza los datos con `trim()`, convierte los campos numéricos y verifica reglas estrictas (email con `@`, salas y turnos permitidos, rango de personas entre 1 y 6). Si falla, responde con código `400` y renderiza el formulario conservando los valores y mostrando un mensaje con `role="alert"`. Si es exitoso, inyecta `req.reservaValidada` y llama a `next()`.

## Pruebas manuales
Se validaron de manera exitosa los estados HTTP `200`, `302`, `400` y `404` mediante la matriz de pruebas manuales, comprobando el registro correcto en la terminal por parte de Morgan y el middleware de medición.

## Persistencia temporal
Los datos se almacenan exclusivamente en memoria RAM. Al reiniciar la aplicación, las altas temporales se eliminan y el sistema regresa a su estado inicial predefinido.

---

## Preguntas teóricas (Explicación con palabras propias)

- **Diferencia entre middleware incorporado, de terceros y personalizado:**
  Los incorporados (*built-in*) vienen incluidos nativamente en Express (como `express.urlencoded` o `express.static`). Los de terceros son paquetes externos instalados vía npm (como `morgan` o `express-ejs-layouts`). Los personalizados son funciones creadas por el desarrollador para cumplir una lógica específica de la aplicación.

- **Cuándo se utiliza `next()`:**
  Se utiliza dentro de una función de middleware para ceder el control al siguiente middleware o ruta en el pipeline. Si no se llama a `next()` ni se envía una respuesta HTTP, la petición quedará colgada indefinidamente.

- **Por qué los parsers aparecen antes de la validación:**
  Porque la validación necesita leer y analizar los datos enviados por el usuario en el cuerpo de la petición (`req.body`). Si los parsers (`express.urlencoded`) no se ejecutaran antes, `req.body` llegaría totalmente indefinido (`undefined`).

- **Diferencia entre alcance global, de router y de ruta:**
  El alcance global afecta a toda la aplicación sin importar la URL. El alcance de router se comparte entre todas las rutas agrupadas bajo un mismo prefijo común (ej. `/reservas`). El alcance de ruta se aplica de forma aislada a un endpoint o método específico.

- **Motivo del evento `finish`:**
  Se utiliza en el middleware de medición para registrar el tiempo exacto en que la respuesta HTTP ha terminado de enviarse por completo al cliente, garantizando que el cálculo de la duración sea real y preciso.

- **Resultado del montaje del router:**
  Permite modularizar y agrupar todas las rutas relacionadas bajo un prefijo común (`/reservas`), simplificando las rutas internas para que sean relativas y aplicando middlewares específicos únicamente a esa sección.

- **Diferencia entre el POST 302 y el GET posterior:**
  El POST responde con un código `302 Found` ordenando al navegador redirigirse tras un alta exitosa. El navegador realiza automáticamente una nueva petición de tipo `GET` a la ruta del listado (`/reservas`) para mostrar la interfaz actualizada.

- **Motivo por el cual las altas desaparecen al reiniciar:**
  Porque los datos están estructurados y almacenados exclusivamente en una variable array residente en la memoria RAM del servidor, sin utilizar bases de datos ni persistencia en archivos de disco físico.
\`\`\`

