function actualizarPartituraClaveSol(notasPresionadas) {
    const canvas = document.getElementById('partituraClaveSol');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const factorEscala = 0.55;
    const espacioEntreLineas = 30 * factorEscala;
    const alturaNota = 10 * factorEscala;
    const offsetY = 198.5 * factorEscala;

    ctx.clearRect(0, 0, width, height);

        // Procesar las notas y dibujar
        const notasUnicas = new Set(notasPresionadas);
        const lineasAdicionalesPorNota = new Map();

        notasUnicas.forEach((nota) => {
            const lineasAdicionales = calcularLineasAdicionales(nota);
            lineasAdicionalesPorNota.set(nota, lineasAdicionales);
        });

        let notaConMasLineasAdicionales = null;
        let maxLineasAdicionales = 0;
        lineasAdicionalesPorNota.forEach((lineas, nota) => {
            if (lineas.length > maxLineasAdicionales) {
                maxLineasAdicionales = lineas.length;
                notaConMasLineasAdicionales = nota;
            }
        });

        if (notasUnicas.size > 1) {
            const posicionComúnX = 210;
            notasUnicas.forEach((nota) => {
                dibujarNota(nota, ctx, espacioEntreLineas, offsetY, alturaNota, posicionComúnX);
            });
            if (notaConMasLineasAdicionales) {
                dibujarLineasAdicionales(notaConMasLineasAdicionales, ctx, espacioEntreLineas, offsetY, posicionComúnX);
            }
        } else {
            notasUnicas.forEach((nota) => {
                const posicion = obtenerPosicionNota(nota);
                if (posicion) {
                    dibujarNota(nota, ctx, espacioEntreLineas, offsetY, alturaNota, posicion.x);
                    dibujarLineasAdicionales(nota, ctx, espacioEntreLineas, offsetY, posicion.x);
                }
            });
        }
    
}


function dibujarNota(nota, ctx, espacioEntreLineas, offsetY, alturaNota, posicionComúnX) {
    const posicion = obtenerPosicionNota(nota);
    if (posicion) {
        ctx.beginPath();
        ctx.arc(posicionComúnX, espacioEntreLineas * posicion.y + offsetY, alturaNota, 0, Math.PI * 2);  
        ctx.fillStyle = '#555878';
        ctx.fill();

        if (esSostenido(nota)) {
            ctx.font = '13px Arial';
            ctx.fillStyle = '#72628c';
            ctx.fillText('#', posicionComúnX - 15, espacioEntreLineas * posicion.y + offsetY);
        }
    }
}

function dibujarLineasAdicionales(nota, ctx, espacioEntreLineas, offsetY, posicionComúnX) {
    const posicion = obtenerPosicionNota(nota);
    if (posicion) {
        const lineasAdicionales = calcularLineasAdicionales(nota);
        lineasAdicionales.forEach((linea) => {
            ctx.strokeStyle = '#555878';  // Color personalizado para las líneas
            // Dibujar las líneas superiores sin restricciones
            if (linea < 0 ) {
                ctx.beginPath();
                ctx.moveTo(posicionComúnX - 20, espacioEntreLineas * linea + offsetY);
                ctx.lineTo(posicionComúnX + 20, espacioEntreLineas * linea + offsetY);
                ctx.stroke();
            }
            // Solo dibujar las líneas inferiores si la nota es mayor a 4.5 y el índice es menor que 4
            else if (linea > 4.5 ) {
                ctx.beginPath();
                ctx.moveTo(posicionComúnX - 20, espacioEntreLineas * linea + offsetY);
                ctx.lineTo(posicionComúnX + 20, espacioEntreLineas * linea + offsetY);
                ctx.stroke();
            }
        });
    }
}

// Función para calcular las líneas adicionales de una nota
function calcularLineasAdicionales(nota) {
    const notasClaveSol = {
        'C3': 8.5, 'C#3': 8.5, 'D3': 8, 'D#3': 8, 'E3': 7.5, 'F3': 7, 'F#3': 7, 'G3': 6.5, 'G#3': 6.5, 
        'A3': 6, 'A#3': 6, 'B3': 5.5, 'C4': 5, 'C#4': 5, 'D4': 4.5, 'D#4': 4.5, 'E4': 4, 'F4': 3.5, 'F#4': 3.5, 
        'G4': 3, 'G#4': 3, 'A4': 2.5, 'A#4': 2.5, 'B4': 2, 'C5': 1.5, 'C#5': 1.5, 'D5': 1, 'D#5': 1, 'E5': 0.5, 
        'F5': 0, 'F#5': 0, 'G5': -0.5, 'G#5': -0.5, 'A5': -1, 'A#5': -1, 'B5': -1.5, 'C6': -2, 'C#6': -2, 
        'D6': -2.5, 'D#6': -2.5, 'E6': -3, 'F6': -3.5, 'F#6': -3.5, 'G6': -4, 'G#6': -4, 'A6': -4.5, 
        'A#6': -4.5, 'B6': -5
    };
    
    const posicionY = notasClaveSol[nota];
    const lineasAdicionales = [];

    // Si la nota está por encima de la última línea del pentagrama
    if (posicionY < -0.5) {
        let lineas = Math.ceil(Math.abs(posicionY));  
        if (posicionY % 1 !== 0) {  // Si tiene decimal, restar una línea
            lineas -= 1;
        }
        for (let i = 1; i <= lineas; i++) {
            lineasAdicionales.push(-i);  
        }
    } 
    // Si la nota está por debajo de la primera línea del pentagrama
    else if (posicionY > 4.5) {
        let lineas = Math.ceil(Math.abs(posicionY));
        if (posicionY % 1 !== 0) {  // Si tiene decimal, restar una línea
            lineas -= 1;
        }
        for (let i = 1; i <= lineas; i++) {
            lineasAdicionales.push(i);  
        }
    }

    return lineasAdicionales;
}


// Función para verificar si una nota es sostenida
function esSostenido(nota) {
    return nota.includes('#');  // Verifica si la nota contiene el símbolo #
}

// Función para obtener la posición Y de la nota en el piano
function obtenerPosicionNota(nota) {
    const notasClaveSol = {

        // TERCERA OCTAVA
        'C3': { x: 210, y: 8.5 },
        'C#3': { x: 210, y: 8.5 },
        'D3': { x: 210, y: 8 },
        'D#3': { x: 210, y: 8 },
        'E3': { x: 210, y: 7.5 },
        'F3': { x: 210, y: 7 },
        'F#3': { x: 210, y: 7 },
        'G3': { x: 210, y: 6.5 },
        'G#3': { x: 210, y: 6.5 },
        'A3': { x: 210, y: 6 },
        'A#3': { x: 210, y: 6 },
        'B3': { x: 210, y: 5.5 },
    
        // CUARTA OCTAVA
        'C4': { x: 210, y: 5 },
        'C#4': { x: 210, y: 5 },
        'D4': { x: 210, y: 4.5 },
        'D#4': { x: 210, y: 4.5 },
        'E4': { x: 210, y: 4 },
        'F4': { x: 210, y: 3.5 },
        'F#4': { x: 210, y: 3.5 },
        'G4': { x: 210, y: 3 },
        'G#4': { x: 210, y: 3 },
        'A4': { x: 210, y: 2.5 },
        'A#4': { x: 210, y: 2.5 },
        'B4': { x: 210, y: 2 },
    
        // QUINTA OCTAVA
        'C5': { x: 210, y: 1.5 },
        'C#5': { x: 210, y: 1.5 },
        'D5': { x: 210, y: 1 },
        'D#5': { x: 210, y: 1 },
        'E5': { x: 210, y: 0.5 },
        'F5': { x: 210, y: 0 },
        'F#5': { x: 210, y: 0 },
        'G5': { x: 210, y: -0.5 },
        'G#5': { x: 210, y: -0.5 },
        'A5': { x: 210, y: -1 },
        'A#5': { x: 210, y: -1 },
        'B5': { x: 210, y: -1.5 },
    
        // SEXTA OCTAVA
        'C6': { x: 210, y: -2 },
        'C#6': { x: 210, y: -2 },
        'D6': { x: 210, y: -2.5 },
        'D#6': { x: 210, y: -2.5 },
        'E6': { x: 210, y: -3 },
        'F6': { x: 210, y: -3.5 },
        'F#6': { x: 210, y: -3.5 },
        'G6': { x: 210, y: -4 },
        'G#6': { x: 210, y: -4 },
        'A6': { x: 210, y: -4.5 },
        'A#6': { x: 210, y: -4.5 },
        'B6': { x: 210, y: -5 },
    };
    
    return notasClaveSol[nota];
    
}
