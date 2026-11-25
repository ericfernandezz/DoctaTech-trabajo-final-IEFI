// Funciones utilitarias puras (sin DOM): se pueden probar con node:test.

const ENTIDADES_HTML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const formatearPrecio = valor => `$${Number(valor).toLocaleString('es-AR')}`;

// Evita que un texto se interprete como HTML al insertarlo con innerHTML (previene XSS).
export const escaparHTML = texto =>
    String(texto ?? '').replace(/[&<>"']/g, caracter => ENTIDADES_HTML[caracter]);

// Minúsculas y sin tildes, para que "periferico" encuentre "Periféricos".
export const normalizarTexto = texto =>
    String(texto ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();

export const aEntero = (valor, porDefecto = 0) => {
    const numero = Number.parseInt(valor, 10);
    return Number.isNaN(numero) ? porDefecto : numero;
};
