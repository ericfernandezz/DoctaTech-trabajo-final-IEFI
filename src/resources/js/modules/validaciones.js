// Validaciones PURAS: cada función devuelve '' si el valor es válido o el mensaje de error.
// Se usan además de los atributos HTML (required, type, minlength, pattern).

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;
const REGEX_CP = /^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{3})$/;

const limpiar = valor => String(valor ?? '').trim();

export function validarNombre(valor, etiqueta = 'El nombre') {
    const texto = limpiar(valor);
    if (!texto) return `${etiqueta} es obligatorio.`;
    if (texto.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`;
    if (texto.length > 40) return `${etiqueta} no puede superar los 40 caracteres.`;
    if (!REGEX_NOMBRE.test(texto)) return `${etiqueta} solo puede contener letras y espacios.`;
    return '';
}

export function validarEmail(valor) {
    const texto = limpiar(valor);
    if (!texto) return 'El correo electrónico es obligatorio.';
    if (!REGEX_EMAIL.test(texto)) return 'Ingresá un correo válido, por ejemplo nombre@dominio.com.';
    return '';
}

export function validarTelefono(valor, { obligatorio = true } = {}) {
    const texto = limpiar(valor);
    if (!texto) return obligatorio ? 'El teléfono es obligatorio.' : '';
    if (!/^[\d\s()+-]+$/.test(texto)) return 'El teléfono solo puede contener números, espacios, +, - y paréntesis.';
    const digitos = texto.replace(/\D/g, '');
    if (digitos.length < 8 || digitos.length > 15) return 'El teléfono debe tener entre 8 y 15 dígitos.';
    return '';
}

export function validarTextoLargo(valor, etiqueta, { min = 1, max = 500, obligatorio = true } = {}) {
    const texto = limpiar(valor);
    if (!texto) return obligatorio ? `${etiqueta} es obligatorio.` : '';
    if (texto.length < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
    if (texto.length > max) return `${etiqueta} no puede superar los ${max} caracteres.`;
    return '';
}

export function validarCodigoPostal(valor) {
    const texto = limpiar(valor);
    if (!texto) return 'El código postal es obligatorio.';
    if (!REGEX_CP.test(texto)) return 'Ingresá un código postal válido (4 dígitos o formato CPA).';
    return '';
}

export const validarSeleccion = (valor, mensaje) => (limpiar(valor) ? '' : mensaje);
export const validarAceptacion = (marcado, mensaje) => (marcado ? '' : mensaje);

export function validarCantidad(valor, maximo, minimo = 1) {
    const numero = Number(valor);
    if (limpiar(valor) === '' || !Number.isInteger(numero)) return 'Ingresá una cantidad entera.';
    if (numero < minimo) return `La cantidad mínima es ${minimo}.`;
    if (numero > maximo) return `La cantidad máxima disponible es ${maximo}.`;
    return '';
}

// Ejecuta un conjunto de reglas { campo: (valor, datos) => mensaje } sobre los datos del formulario.
export function validarFormulario(datos, reglas) {
    const errores = {};
    for (const [campo, regla] of Object.entries(reglas)) {
        const mensaje = regla(datos[campo], datos);
        if (mensaje) errores[campo] = mensaje;
    }
    return { valido: Object.keys(errores).length === 0, errores };
}
