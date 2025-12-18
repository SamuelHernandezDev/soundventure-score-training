const optionBar = document.getElementById('optionsBar');
const claveDisplay = document.getElementById('clave-display');
const partituraClaveFa = document.getElementById('partituraClaveFa');

document.querySelectorAll('.option[data-group="ModoPiano"]').forEach(option => {
    option.addEventListener('click', function () {
        let claveSeleccionada = 'sol'; // Definir valor por defecto
        let esDual = false; // Para saber si es la opción dual

        if (this.textContent.includes('𝄞𝄢')) { // Si se selecciona la opción dual
            claveSeleccionada = 'dual';
            esDual = true;
            partituraClaveFa.style.top = '-175px';
            setOpcionDual(!getOpcionDual());
            actualizarPartituraClaveFa([]); 
        } else if (this.textContent.includes('𝄞')) {
            claveSeleccionada = 'sol';
            LimpiarPartituraDual();
            partituraClaveFa.style.top = '-355px';
        } else if (this.textContent.includes('𝄢')) {
            claveSeleccionada = 'fa';
            LimpiarPartituraDual();
            partituraClaveFa.style.top = '-355px';
        }

        // Actualizar la UI
        document.querySelectorAll('.option[data-group="ModoPiano"]').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        // Cambiar el texto del display
        claveDisplay.textContent = claveSeleccionada === 'sol' ? 'Sol' : 'Fa';

        // Llamar a las funciones de inicialización
        if (esDual) {
            inicializarPartitura('sol' );
            inicializarPartituraDual();
        } else {
            inicializarPartitura(claveSeleccionada);
            window.dispatchEvent(new CustomEvent('claveCambiada', {
                detail: claveSeleccionada
            }));
        }
    });
});

// Establecer clave de sol como activa al inicio
window.onload = () => {
    inicializarPartitura('sol');
    document.querySelector('.option[data-group="ModoPiano"]').classList.add('active');
    partituraClaveFa.style.top = '-355px'; // Posición inicial
};


let opcionDualActiva = false;

function setOpcionDual(activa) {
    opcionDualActiva = activa;
}

function getOpcionDual() {
    return opcionDualActiva;
}


document.querySelectorAll('.option[data-group="ModoLectura"]').forEach(option => {
    option.addEventListener('click', function () {
        let LecturaSeleccionada = 'notas'; // Definir valor por defecto

        if (this.textContent.includes('♩')) { // Si se selecciona la opción dual
            LecturaSeleccionada = 'notas';
        } else if (this.textContent.includes('♬')) {
            LecturaSeleccionada = 'escalas';
        } else if (this.textContent.includes('♯⠇')) {
            LecturaSeleccionada = 'acordes';
            partituraClaveFa.style.top = '-355px';
        } else if (this.textContent.includes('◮')) {
            LecturaSeleccionada = 'zen';
        }
    });
});