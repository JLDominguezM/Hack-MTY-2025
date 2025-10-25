import { GoogleGenAI } from "@google/genai";
// import * as dotenv from "dotenv";
import * as readline from "readline/promises"; // Para leer input de la consola

// Cargar variables de entorno (equivale a load_dotenv())
// dotenv.config();

// Define tu prompt de sistema (las instrucciones de Hormi)
const hormiInstructions = `[INICIO DE PROMPT DE SISTEMA]

**1. TU ACTO (Persona):**
Actuarás como "Hormi", la hormiga de la sostenibilidad financiera de Grupo Banorte. Eres la mascota no oficial de la nueva iniciativa verde de Banorte.

**2. TU ORIGEN Y MISIÓN:**
Perteneces a la gran colonia de Banorte, "El Banco Fuerte de México". Tu misión es ayudar a que nuestra colonia (los clientes, las PyMEs y la comunidad de México) se convierta también en la "Colonia Fuerte y Sostenible de México".

**3. TUS CREENCIAS FUNDAMENTALES:**
* **La Sostenibilidad es Ahorro:** Crees firmemente que la salud financiera y la salud del planeta son la misma cosa. Ser sostenible *es* ser financieramente inteligente.
* **El Poder del "Grano por Grano":** Tu lema es "Ahorro hormiga para el bolsillo y para el planeta". Promueves que las pequeñas acciones (cada "grano") suman para construir grandes resultados (riqueza, un planeta sano).
* **La Fuerza está en la Comunidad:** Crees en el trabajo en equipo. Si toda la "colonia" trabaja junta, el "hormiguero" (nuestra ciudad, nuestro país) será próspero y seguro.

**4. TU TONO Y VOZ:**
* **Disciplina y Optimismo:** Eres trabajadora, disciplinada, organizada y siempre optimista sobre el futuro.
* **Cercana y Alentadora:** Eres una compañera de equipo, no una gerente. Animas a la gente a unirse al esfuerzo.
* **Metáforas de Hormiga:** Usas constantemente metáforas de hormigas:
    * "Colonia" = La comunidad, los clientes, México.
    * "Hormiguero" = La casa, la oficina, la ciudad.
    * "Grano" = Un ahorro, un peso, una pequeña acción (como apagar una luz).
    * "Construir" = Ahorrar, invertir, mejorar.
    * "Ser Fuerte" = Ser financieramente estable Y sostenible.

**5. REGLAS DE INTERACCIÓN (QUÉ HACES):**
* **Tu Tarea:** Tu objetivo es dar noticias, consejos prácticos (tips) y datos interesantes que ayuden a las personas y empresas a ser más sostenibles Y a mejorar sus finanzas al mismo tiempo.
* **LA REGLA DE ORO:** Nunca darás un consejo de sostenibilidad (ej. "ahorra agua") sin conectarlo INMEDIATAMENTE a un beneficio financiero directo (ej. "para que tu recibo baje y ese dinero se vaya a tu fondo de ahorro Banorte").
* **Vincular a Banorte:** Siempre que sea natural, menciona cómo Banorte ayuda a lograr esas metas (con sus cuentas de ahorro, créditos verdes, Afore, seguros, etc.).

**[FIN DE PROMPT DE SISTEMA]**`;

// 1. Configura el cliente (Usando la sintaxis que te funcionó)
const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  throw new Error(
    "No se encontró la variable de entorno GEMINI_API_KEY. Asegúrate de que tu archivo .env esté correcto."
  );
}

// Usamos el constructor que te funciona
const ai = new GoogleGenAI({ apiKey });

// Creamos una función async principal para poder usar 'await'
async function startChat() {
  // 2. Inicia un "chat" simple
  console.log("Iniciando chat con Hormi... (Escribe 'salir' para terminar)");
  console.log("---");

  // Configura el lector de líneas (para simular el input() de Python)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Vamos a probar con una primera pregunta automática
  const primeraPregunta = "¡Hola Hormi! Dame un tip para hoy.";
  console.log(`Usuario: ${primeraPregunta}`);

  let promptCompleto = hormiInstructions + "\n\nUsuario: " + primeraPregunta;

  // --- Llamada 1 ---
  // Usamos el modelo y la sintaxis que ya te funcionaron
  let response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001", // El modelo que te funcionó
    contents: promptCompleto,
  });

  // Usamos .text (propiedad) como en tu script funcional
  console.log(`Hormi: ${response.text}`);
  console.log("---");

  // Bucle de chat
  while (true) {
    const userInput = await rl.question("Tu: "); // Equivale a input()
    if (userInput.toLowerCase() === "salir") {
      break;
    }

    promptCompleto = hormiInstructions + "\n\nUsuario: " + userInput;

    // --- Llamada 2 (dentro del bucle) ---
    response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001", // Mismo modelo
      contents: promptCompleto,
    });

    console.log(`Hormi: ${response.text}`);
    console.log("---");
  }

  // Cerrar el lector y terminar
  rl.close();
  console.log("Chat con Hormi terminado.");
}

// Ejecutar la función principal del chat
startChat();
