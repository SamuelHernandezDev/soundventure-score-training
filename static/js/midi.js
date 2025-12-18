let notasPresionadas = new Set();  // Mantén el conjunto de notas presionadas

let claveActual = "sol"; // Variable global para almacenar la clave actual

// Función para cargar el script de la clave activa

function cargarScriptClave() {

    const script = document.createElement('script');

    script.type = 'text/javascript';

    script.src = `/static/js/clave${claveActual.charAt(0).toUpperCase() + claveActual.slice(1)}.js`; // Cargar el script correspondiente

    script.onload = () => {

        console.log(`Script de clave ${claveActual} cargado.`);

        actualizarPartitura(); // Llamar a actualizarPartitura después de cargar el script

    };

    document.body.appendChild(script);

  
    // Actualizar el texto de la clave actual en la página

    const claveDisplay = document.getElementById("clave-display");

    claveDisplay.textContent = claveActual.charAt(0).toUpperCase() + claveActual.slice(1);  // Cambia el texto a "Sol" o "Fa"

}

// Función para manejar los mensajes MIDI
function onMIDIMessage(event) {
    const [status, note, velocity] = event.data;
    const nombreNota = midiToNota(note);  // Convertir el número de nota a nombre
    const tecla = document.querySelector(`[data-key="${nombreNota}"]`); // Selección de la tecla visual
    const teclaDisplay = document.getElementById("tecla-display");
    
    // Verificar si la tecla fue presionada (Nota ON)
    if (status === 144 && velocity > 0) {  
        if (!notasPresionadas.has(nombreNota)) {
            notasPresionadas.add(nombreNota);  
            console.log(`Nota presionada: ${nombreNota}`); 
            actualizarPartitura(); 
             // Mostrar todas las notas presionadas como una lista
             teclaDisplay.textContent = `Teclas MIDI presionadas: ${Array.from(notasPresionadas).join(", ")}`;           
        }
        if (tecla) tecla.classList.add('pressed');  // Añadir clase para transición visual

    } else if (status === 128 || (status === 144 && velocity === 0)) {  
        // Nota OFF
        if (notasPresionadas.has(nombreNota)) {
            notasPresionadas.delete(nombreNota);  
            console.log(`Nota liberada: ${nombreNota}`);
            actualizarPartitura();
             // Mostrar todas las notas presionadas como una lista
             teclaDisplay.textContent = `Teclas MIDI presionadas: ${Array.from(notasPresionadas).join(", ")}`;
        }
        if (tecla) tecla.classList.remove('pressed');  // Quitar clase visual
    }

}

// Función para convertir el número de la nota MIDI a su nombre

function midiToNota(note) {

    const notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const octava = Math.floor(note / 12) - 1;  // Determina la octava de la nota

    const nota = notas[note % 12];            // Obtiene la nota de acuerdo al número MIDI

    console.log(`Convertido MIDI ${note} a: ${nota}${octava}`);  // Depurar la conversión

    return `${nota}${octava}`;  // Devuelve la nota en formato 'C4', 'D#5', etc.

}

  
// Pedir acceso a los dispositivos MIDI

if (navigator.requestMIDIAccess) {

    navigator.requestMIDIAccess().then((midiAccess) => {

        const inputs = midiAccess.inputs;  // Accede a todos los dispositivos MIDI conectados

  
        // Asignar el manejador de mensajes MIDI para cada dispositivo conectado

        inputs.forEach(input => {

            input.onmidimessage = onMIDIMessage;  // Asocia la función onMIDIMessage al evento onmidimessage

        });


        console.log("Conectado a los dispositivos MIDI");

    }).catch((err) => {

        console.error("No se pudo acceder al dispositivo MIDI", err);

    });

} else {

    console.log("Web MIDI API no soportada en este navegador.");

}

// Cargar el script correspondiente al inicio de la página

cargarScriptClave();
  
// Escuchar el evento de cambio de clave
window.addEventListener('claveCambiada', function(event) {
    claveActual = event.detail; // Obtener la clave desde el evento
    console.log("Clave actual cambiada a:", claveActual);

    // Cargar el script correspondiente a la clave seleccionada
    cargarScriptClave();
});


// Función para actualizar la partitura
function actualizarPartitura() {
    console.log("Clave actual: ", claveActual); // Agregado para depuración

    if (claveActual === "sol") {
        console.log("Llamando a actualizarPartituraClaveSol");
        if (typeof actualizarPartituraClaveSol === "function") {
            actualizarPartituraClaveSol(Array.from(notasPresionadas));
        }
    } else if (claveActual === "fa") {
        console.log("Llamando a actualizarPartituraClaveFa");
        if (typeof actualizarPartituraClaveFa === "function") {
            actualizarPartituraClaveFa(Array.from(notasPresionadas));
        }
    } else if (claveActual === "dual") {  // Nuevo caso dual
        console.log("Llamando a ambas claves");
        if (typeof actualizarPartituraClaveSol === "function") {
            actualizarPartituraClaveSol(Array.from(notasPresionadas));
        }
        if (typeof actualizarPartituraClaveFa === "function") {
            actualizarPartituraClaveFa(Array.from(notasPresionadas));
        }
    } else {
        console.warn("Clave o función no definida correctamente.");
    }
}
