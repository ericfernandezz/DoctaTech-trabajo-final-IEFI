
const ENTIDADES_HTML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const formatearPrecio = valor => `$${Number(valor).toLocaleString('es-AR')}`;

export const escaparHTML = texto =>
    String(texto ?? '').replace(/[&<>"']/g, caracter => ENTIDADES_HTML[caracter]);

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
