import { CONFIG } from '../config.js';
import { esItemValido } from './carrito.js';
import { leerJSON, guardarJSON, obtenerStorage } from './almacenamiento.js';

const CLAVE = CONFIG.claveCarrito;

export function leerCarrito(storage = obtenerStorage()) {
    const datos = leerJSON(CLAVE, [], storage);
    if (!Array.isArray(datos)) return [];
    return datos.filter(esItemValido).map(item => ({ stock: CONFIG.maxPorProducto, imagen: '', ...item }));
}

export const guardarCarrito = (items, storage = obtenerStorage()) => guardarJSON(CLAVE, items, storage);
