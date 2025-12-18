function actualizarPartituraClaveFa(notasPresionadas) {
    const canvas = document.getElementById('partituraClaveFa');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const factorEscala = 0.55;
    const espacioEntreLineas = 30 * factorEscala;
    const alturaNota = 10 * factorEscala;
    
    // Selección de offsetY según la opción del menú
    const offsetY = getOpcionDual() ? 183.5 * factorEscala : 198 * factorEscala;
    
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
    const notasClaveFa = {
        'C1': 9.5, 'C#1': 9.5, 'D1': 9, 'D#1': 9, 'E1': 8.5, 'F1': 8, 'F#1': 8, 'G1': 7.5, 'G#1': 7.5, 'A1': 7, 'A#1': 7, 'B1': 6.5,
        'C2': 6, 'C#2': 6, 'D2': 5.5, 'D#2': 5.5, 'E2': 5, 'F2': 4.5, 'F#2': 4.5, 'G2': 4, 'G#2': 4, 'A2': 3.5, 'A#2': 3.5, 'B2': 3,
        'C3': 2.5, 'C#3': 2.5, 'D3': 2, 'D#3': 2, 'E3': 1.5, 'F3': 1, 'F#3': 1, 'G3': 0.5, 'G#3': 0.5, 'A3': 0, 'A#3': 0, 'B3': -0.5,
        'C4': -1, 'C#4': -1, 'D4': -1.5, 'D#4': -1.5, 'E4': -2, 'F4': -2.5, 'F#4': -2.5, 'G4': -3, 'G#4': -3, 'A4': -3.5, 'A#4': -3.5, 'B4': -4
    };
    
    
    const posicionY = notasClaveFa[nota];
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
    const notasClaveFa = {

        //PRIMERA OCTAVA
        'C1': { x: 210, y: 9.5 },
        'C#1': { x: 210, y: 9.5 },
        'D1': { x: 210, y: 9 },
        'D#1': { x: 210, y: 9 },
        'E1': { x: 210, y: 8.5 },
        'F1': { x: 210, y: 8 },
        'F#1': { x: 210, y: 8 },
        'G1': { x: 210, y: 7.5 },
        'G#1': { x: 210, y: 7.5 },
        'A1': { x: 210, y: 7 },
        'A#1': { x: 210, y: 7 },
        'B1': { x: 210, y: 6.5 },
    
        //SEGUNDA OCTAVA
        'C2': { x: 210, y: 6 },
        'C#2': { x: 210, y: 6 },
        'D2': { x: 210, y: 5.5 },
        'D#2': { x: 210, y: 5.5 },
        'E2': { x: 210, y: 5 },
        'F2': { x: 210, y: 4.5 },
        'F#2': { x: 210, y: 4.5 },
        'G2': { x: 210, y: 4 },
        'G#2': { x: 210, y: 4 },
        'A2': { x: 210, y: 3.5 },
        'A#2': { x: 210, y: 3.5 },
        'B2': { x: 210, y: 3 },
    
        //TERCERA OCTAVA
        'C3': { x: 210, y: 2.5 },
        'C#3': { x: 210, y: 2.5 },
        'D3': { x: 210, y: 2 },
        'D#3': { x: 210, y: 2 },
        'E3': { x: 210, y: 1.5 },
        'F3': { x: 210, y: 1 },
        'F#3': { x: 210, y: 1 },
        'G3': { x: 210, y: 0.5 },
        'G#3': { x: 210, y: 0.5 },
        'A3': { x: 210, y: 0 },
        'A#3': { x: 210, y: 0 },
        'B3': { x: 210, y: -0.5 },
    
        //CUARTA OCTAVA
        'C4': { x: 210, y: -1 },
        'C#4': { x: 210, y: -1 },
        'D4': { x: 210, y: -1.5 },
        'D#4': { x: 210, y: -1.5 },
        'E4': { x: 210, y: -2 },
        'F4': { x: 210, y: -2.5 },
        'F#4': { x: 210, y: -2.5 },
        'G4': { x: 210, y: -3 },
        'G#4': { x: 210, y: -3 },
        'A4': { x: 210, y: -3.5 },
        'A#4': { x: 210, y: -3.5 },
        'B4': { x: 210, y: -4 },
    };
    return notasClaveFa[nota];
}

