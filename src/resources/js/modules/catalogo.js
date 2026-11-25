// REGLAS DE NEGOCIO del catálogo (funciones puras, sin red ni DOM).
import { normalizarTexto } from './utils.js';

const STOCK_BAJO_MAXIMO = 5;

// Filtra por texto (todas las palabras deben aparecer), categoría, marca y rango de precio.
export function filtrarProductos(productos, filtros = {}) {
    const { texto = '', categoria = '', marca = '', precioMin = null, precioMax = null } = filtros;
    const terminos = normalizarTexto(texto).split(/\s+/).filter(Boolean);

    return productos.filter(producto => {
        if (terminos.length > 0) {
            const pajar = normalizarTexto(
                `${producto.nombre} ${producto.marca} ${producto.categoria} ${producto.descripcion}`
            );
            if (!terminos.every(termino => pajar.includes(termino))) return false;
        }
        if (categoria && producto.categoria !== categoria) return false;
        if (marca && producto.marca !== marca) return false;
        if (precioMin !== null && producto.precio < precioMin) return false;
        if (precioMax !== null && producto.precio > precioMax) return false;
        return true;
    });
}

// Devuelve una copia ordenada (no modifica el array original).
export function ordenarProductos(productos, criterio = 'relevancia') {
    const copia = [...productos];
    switch (criterio) {
        case 'precio-asc':
            return copia.sort((a, b) => a.precio - b.precio);
        case 'precio-desc':
            return copia.sort((a, b) => b.precio - a.precio);
        case 'nombre':
            return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        default:
            return copia.sort((a, b) => a.id - b.id);
    }
}

// Valores únicos de un campo (para armar los <select> de categoría y marca).
export const valoresUnicos = (productos, campo) =>
    [...new Set(productos.map(producto => producto[campo]))].sort((a, b) => a.localeCompare(b, 'es'));

export const productosRelacionados = (productos, producto, maximo = 3) =>
    productos
        .filter(item => item.id !== producto.id && item.categoria === producto.categoria)
        .slice(0, maximo);

export function estadoStock(stock) {
    if (!Number.isFinite(stock) || stock > STOCK_BAJO_MAXIMO) {
        return { texto: 'Stock disponible', clase: '', agotado: false };
    }
    if (stock <= 0) return { texto: 'Sin stock', clase: 'stock-agotado', agotado: true };
    return { texto: `¡Últimas ${stock} unidades!`, clase: 'stock-bajo', agotado: false };
}
