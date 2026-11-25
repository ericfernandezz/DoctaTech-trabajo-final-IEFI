// Ayudas de DOM para formularios: leer datos y mostrar/limpiar errores de validación.

export const datosDelFormulario = formulario => Object.fromEntries(new FormData(formulario));

const campoDe = (formulario, nombre) => {
    const elemento = formulario.elements[nombre];
    return elemento instanceof RadioNodeList ? elemento[0] : elemento;
};

export function mostrarError(formulario, nombre, mensaje) {
    const campo = campoDe(formulario, nombre);
    const contenedor = formulario.querySelector(`[data-error-de="${nombre}"]`);
    if (contenedor) contenedor.textContent = mensaje;
    if (!campo) return;

    if (mensaje) {
        campo.setAttribute('aria-invalid', 'true');
        if (contenedor?.id) campo.setAttribute('aria-describedby', contenedor.id);
    } else {
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-describedby');
    }
}

export function limpiarErrores(formulario) {
    formulario.querySelectorAll('[data-error-de]').forEach(contenedor => {
        mostrarError(formulario, contenedor.dataset.errorDe, '');
    });
}

export function mostrarErrores(formulario, errores) {
    limpiarErrores(formulario);
    const nombres = Object.keys(errores);
    nombres.forEach(nombre => mostrarError(formulario, nombre, errores[nombre]));
    campoDe(formulario, nombres[0])?.focus();
}

// Validación "en vivo": al salir de un campo se valida solo ese campo; al corregirlo, el error desaparece.
export function activarValidacionEnVivo(formulario, reglas) {
    const validarCampo = nombre => {
        const regla = reglas[nombre];
        if (!regla) return;
        mostrarError(formulario, nombre, regla(datosDelFormulario(formulario)[nombre], datosDelFormulario(formulario)));
    };

    formulario.addEventListener('focusout', evento => {
        if (evento.target.name) validarCampo(evento.target.name);
    });

    formulario.addEventListener('input', evento => {
        const nombre = evento.target.name;
        if (nombre && evento.target.getAttribute('aria-invalid') === 'true') validarCampo(nombre);
    });
}
