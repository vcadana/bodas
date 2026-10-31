
"use strict";

// =====================================
// 1. MÚSICA DE LA BODA
// =====================================

const musica = document.querySelector("#musicaBoda");
const btnMusica = document.querySelector("#btnMusica");

btnMusica.addEventListener("click", async () => {
  if (musica.paused) {
    try {
      await musica.play();
    } catch (error) {
      console.warn("No se pudo reproducir la música:", error);
      alert("No se pudo reproducir la canción.");
    }
  } else {
    musica.pause();
  }
});

function actualizarBotonMusica() {
  const activa = !musica.paused;

  btnMusica.classList.toggle("activa", activa);
  btnMusica.setAttribute("aria-pressed", String(activa));

  btnMusica.setAttribute(
    "aria-label",
    activa ? "Pausar música" : "Reproducir música"
  );

  btnMusica.title = activa
    ? "Pausar música"
    : "Activar música";
}

musica.addEventListener("play", actualizarBotonMusica);
musica.addEventListener("pause", actualizarBotonMusica);
musica.addEventListener("ended", actualizarBotonMusica);

// =====================================
// 2. CUENTA ATRÁS
// =====================================

// Fecha de la boda: 11 septiembre 2027.
// Hasta conocer la hora, contamos hasta
// el comienzo del día en Salamanca.
// El horario de verano será UTC+02:00.

const fechaBoda = "2027-09-11T00:00:00+02:00";

function actualizarContador() {
  const destino = new Date(fechaBoda).getTime();

  if (!Number.isFinite(destino)) return;

  const diferencia = Math.max(0, destino - Date.now());

  const valores = {
    dias: Math.floor(diferencia / 86400000),
    horas: Math.floor((diferencia / 3600000) % 24),
    minutos: Math.floor((diferencia / 60000) % 60),
    segundos: Math.floor((diferencia / 1000) % 60)
  };

  for (const [id, valor] of Object.entries(valores)) {
    document.getElementById(id).textContent = valor;
  }

  if (diferencia === 0) {
    document.querySelector("#mensajeContador").textContent =
      "¡Ha llegado nuestro gran día!";
  }
}

actualizarContador();
setInterval(actualizarContador, 1000);

// =====================================
// 3. ELEMENTOS DEL FORMULARIO
// =====================================

const formulario = document.querySelector("#formInvitados");
const asistencia = document.querySelector("#asistencia");
const datosAsistentes = document.querySelector("#datosAsistentes");

const numeroAcompanantes =
  document.querySelector("#acompanantes");

const listaAcompanantes =
  document.querySelector("#listaAcompanantes");

const detallePrincipalBox =
  document.querySelector("#detallePrincipalBox");

const detallePrincipal =
  document.querySelector("#detallePrincipal");

const estadoFormulario =
  document.querySelector("#estadoFormulario");

const alergiasPrincipal = document.querySelectorAll(
  'input[name="alergiaPrincipal"]'
);

const opcionesTransporte = document.querySelectorAll(
  'input[name="transporte"]'
);

// =====================================
// 4. MOSTRAR CAMPOS SI ASISTE
// =====================================

function actualizarAsistencia() {
  const asiste = asistencia.value === "si";

  datosAsistentes.hidden = !asiste;

  alergiasPrincipal.forEach(radio => {
    radio.required = asiste;

    if (!asiste) {
      radio.checked = false;
    }
  });

  opcionesTransporte.forEach(radio => {
    radio.required = asiste;

    if (!asiste) {
      radio.checked = false;
    }
  });

  if (!asiste) {
    numeroAcompanantes.value = "0";
    listaAcompanantes.replaceChildren();

    detallePrincipal.value = "";
    detallePrincipal.required = false;
    detallePrincipalBox.hidden = true;
  }
}

asistencia.addEventListener(
  "change",
  actualizarAsistencia
);

// =====================================
// 5. ALERGIAS DEL INVITADO PRINCIPAL
// =====================================

alergiasPrincipal.forEach(radio => {
  radio.addEventListener("change", () => {
    const tieneAlergia =
      document.querySelector(
        'input[name="alergiaPrincipal"]:checked'
      )?.value === "si";

    detallePrincipalBox.hidden = !tieneAlergia;
    detallePrincipal.required = tieneAlergia;

    if (!tieneAlergia) {
      detallePrincipal.value = "";
    }
  });
});

// =====================================
// 6. CREAR CAMPOS DE ACOMPAÑANTES
// =====================================

function crearCampo(tipo, id, nombre, obligatorio = true) {
  const input = document.createElement("input");

  input.type = tipo;
  input.id = id;
  input.name = nombre;
  input.className = "form-control";
  input.required = obligatorio;
  input.maxLength = 100;

  return input;
}

function crearGrupoCampo(texto, input) {
  const grupo = document.createElement("div");
  grupo.className = "col-md-6";

  const label = document.createElement("label");
  label.className = "form-label";
  label.htmlFor = input.id;
  label.textContent = texto;

  grupo.append(label, input);

  return grupo;
}

function crearAcompanante(indice) {
  const tarjeta = document.createElement("div");

  tarjeta.className = "tarjeta-acompanante";
  tarjeta.dataset.acompanante = String(indice);

  // Título
  const titulo = document.createElement("h4");
  titulo.textContent = `Acompañante ${indice}`;

  // Fila de nombre y apellidos
  const fila = document.createElement("div");
  fila.className = "row g-3";

  const nombre = crearCampo(
    "text",
    `nombreAcompanante${indice}`,
    `nombreAcompanante${indice}`
  );

  const apellidos = crearCampo(
    "text",
    `apellidosAcompanante${indice}`,
    `apellidosAcompanante${indice}`
  );

  fila.append(
    crearGrupoCampo("Nombre *", nombre),
    crearGrupoCampo("Apellidos *", apellidos)
  );

  // Pregunta sobre alergias
  const pregunta = document.createElement("p");
  pregunta.className = "mt-3 mb-2";

  pregunta.textContent =
    "¿Tiene alguna alergia o intolerancia alimentaria? *";

  const opciones = document.createElement("div");
  opciones.className = "d-flex gap-4 flex-wrap";

  // Campo de detalle de alergias
  const detalleBox = document.createElement("div");
  detalleBox.className = "mt-3";
  detalleBox.hidden = true;

  const detalle = crearCampo(
    "text",
    `detalleAcompanante${indice}`,
    `detalleAcompanante${indice}`,
    false
  );

  detalle.maxLength = 300;

  detalleBox.append(
    crearGrupoCampo("Especifica las alergias *", detalle)
  );

  // Radios Sí / No
  ["si", "no"].forEach(valor => {
    const contenedor = document.createElement("div");
    contenedor.className = "form-check";

    const radio = document.createElement("input");

    radio.type = "radio";
    radio.className = "form-check-input";
    radio.name = `alergiaAcompanante${indice}`;
    radio.id = `alergiaAcompanante${indice}${valor}`;
    radio.value = valor;
    radio.required = true;

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = radio.id;
    label.textContent = valor === "si" ? "Sí" : "No";

    radio.addEventListener("change", () => {
      const tieneAlergia = tarjeta.querySelector(
        `input[name="alergiaAcompanante${indice}"]:checked`
      )?.value === "si";

      detalleBox.hidden = !tieneAlergia;
      detalle.required = tieneAlergia;

      if (!tieneAlergia) {
        detalle.value = "";
      }
    });

    contenedor.append(radio, label);
    opciones.append(contenedor);
  });

  tarjeta.append(
    titulo,
    fila,
    pregunta,
    opciones,
    detalleBox
  );

  return tarjeta;
}

// =====================================
// 7. ACTUALIZAR NÚMERO DE ACOMPAÑANTES
// =====================================

numeroAcompanantes.addEventListener("change", () => {
  const cantidad = Number(numeroAcompanantes.value);

  const actuales = listaAcompanantes.querySelectorAll(
    ".tarjeta-acompanante"
  );

  // Eliminar únicamente los sobrantes.
  actuales.forEach((tarjeta, indice) => {
    if (indice >= cantidad) {
      tarjeta.remove();
    }
  });

  // Añadir los nuevos sin borrar los anteriores.
  for (
    let indice = listaAcompanantes.children.length + 1;
    indice <= cantidad;
    indice++
  ) {
    listaAcompanantes.append(
      crearAcompanante(indice)
    );
  }
});

// =====================================
// 8. FUNCIONES AUXILIARES
// =====================================

function valor(id) {
  return document.getElementById(id).value.trim();
}

function radioSeleccionado(nombre) {
  return document.querySelector(
    `input[name="${nombre}"]:checked`
  )?.value || "";
}

// =====================================
// 9. OBTENER TODAS LAS PERSONAS
// =====================================

function obtenerPersonas() {
  if (asistencia.value !== "si") {
    return [];
  }

  const tieneAlergiaPrincipal =
    radioSeleccionado("alergiaPrincipal") === "si";

  const personas = [{
    tipo: "principal",
    nombre: valor("nombre"),
    apellidos: valor("apellidos"),
    tieneAlergias: tieneAlergiaPrincipal,
    detalleAlergias: tieneAlergiaPrincipal
      ? valor("detallePrincipal")
      : ""
  }];

  const cantidad = Number(numeroAcompanantes.value);

  for (let i = 1; i <= cantidad; i++) {
    const tieneAlergias =
      radioSeleccionado(
        `alergiaAcompanante${i}`
      ) === "si";

    personas.push({
      tipo: "acompanante",
      nombre: valor(`nombreAcompanante${i}`),
      apellidos: valor(`apellidosAcompanante${i}`),
      tieneAlergias,
      detalleAlergias: tieneAlergias
        ? valor(`detalleAcompanante${i}`)
        : ""
    });
  }

  return personas;
}

// =====================================
// 10. PREPARAR CONFIRMACIÓN PARA N8N
// =====================================

function prepararConfirmacion() {
  const asiste = asistencia.value === "si";
  const personas = obtenerPersonas();

  return {
    evento: "Boda Javi y Tess",
    fechaEvento: "2027-09-11",
    lugarEvento:
      "Finca Jardines de Utrera, Morzábez, Salamanca",

    nombreContacto: valor("nombre"),
    apellidosContacto: valor("apellidos"),
    email: valor("email"),

    asistencia: asiste ? "si" : "no",

    numeroAcompanantes: asiste
      ? personas.length - 1
      : 0,

    totalAsistentes: personas.length,

    transporte: asiste
      ? radioSeleccionado("transporte")
      : "",

    mensaje: valor("mensaje"),

    personas
  };
}

// =====================================
// 11. VALIDAR Y PREPARAR ENVÍO
// =====================================

formulario.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!formulario.reportValidity()) {
    return;
  }

  const confirmacion = prepararConfirmacion();

  // Aquí conectaremos el Webhook de n8n.
  // Por ahora NO se envían datos reales.
  // No incluir credenciales de Google en este archivo.

  estadoFormulario.textContent =
    "Formulario validado correctamente. " +
    "Todavía no está conectado a n8n, " +
    "por lo que no se ha enviado tu confirmación.";

  estadoFormulario.className =
    "mt-3 text-center text-secondary";
});

// Inicializar el formulario.
actualizarAsistencia();