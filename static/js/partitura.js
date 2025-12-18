function inicializarPartitura(clave = 'sol') {
    const canvas = document.getElementById('partituraIndividual');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const factorEscala = 0.55;

    // Definiciones de imágenes y posiciones
    const imagenClaveSol = '/static/image/ClaveSol3.png';
    const posicionImagenSol = { x: 31, y: 95 };
    const tamanoImagenSol = { ancho: 90, alto: 110 };

    const imagenClaveFa = '/static/image/ClaveFa3.png';
    const posicionImagenFa = { x: 45, y: 103 }; 
    const tamanoImagenFa = { ancho: 75, alto: 70 };

    ctx.clearRect(0, 0, width, height); // Limpiar canvas antes de redibujar

    // Dibujar líneas del pentagrama
    const espacioEntreLineas = 30 * factorEscala;
    const offsetY = 198 * factorEscala;
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = '#555878';
        ctx.beginPath();
        ctx.moveTo(50 * factorEscala, espacioEntreLineas * i + offsetY);
        ctx.lineTo(width - (50 * factorEscala), espacioEntreLineas * i + offsetY);
        ctx.stroke();
    }

    // Dibujar clave basada en la selección
    const claveImg = new Image();
    if (clave === 'sol') {
        claveImg.src = imagenClaveSol;
        claveImg.onload = () => ctx.drawImage(claveImg, posicionImagenSol.x, posicionImagenSol.y, tamanoImagenSol.ancho, tamanoImagenSol.alto);
    } else if (clave === 'fa') {
        claveImg.src = imagenClaveFa;
        claveImg.onload = () => ctx.drawImage(claveImg, posicionImagenFa.x, posicionImagenFa.y, tamanoImagenFa.ancho, tamanoImagenFa.alto);
    }
}

function inicializarPartituraDual() {
    const canvas = document.getElementById('partituraDual');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const factorEscala = 0.55;

    const imagenClaveFa = '/static/image/ClaveFa3.png';
    const posicionImagenFa = { x: 45, y: 95 }; 
    const tamanoImagenFa = { ancho: 75, alto: 70 };

    ctx.clearRect(0, 0, width, height); // Limpiar canvas antes de redibujar

    // Dibujar la clave de Fa y su pentagrama aparte, entonces se recorre a esta posicion si se tiene seleccionada ambas claves
    const claveFaImg = new Image();
    claveFaImg.src = imagenClaveFa;
    claveFaImg.onload = () => {
        ctx.drawImage(claveFaImg, posicionImagenFa.x, posicionImagenFa.y, tamanoImagenFa.ancho, tamanoImagenFa.alto);

        // Dibujar líneas del pentagrama para clave de Fa
        const espacioEntreLineasFa = 30 * factorEscala;
        const offsetYFa = 184 * factorEscala;
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = '#555878';  // Color personalizado para las líneas
            ctx.beginPath();
            ctx.moveTo(50 * factorEscala, espacioEntreLineasFa * i + offsetYFa);
            ctx.lineTo(width - (50 * factorEscala), espacioEntreLineasFa * i + offsetYFa);
            ctx.stroke();
        }
    };
}


function LimpiarPartituraDual() {
    const canvas = document.getElementById('partituraDual');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height); // Limpiar canvas antes de redibujar

}
