
import { CONFIG } from '../config.js';
import { agregarItem, cambiarCantidad, quitarItem } from './carrito.js';
import { leerCarrito, guardarCarrito } from './carrito-persistencia.js';

const oyentes = new Set();
let items = leerCarrito();

const avisar = () => oyentes.forEach(oyente => oyente(items));

function actualizar(nuevosItems) {
    items = nuevosItems;
    guardarCarrito(items);
    avisar();
}

export const obtenerItems = () => items;

export function suscribir(oyente) {
    oyentes.add(oyente);
    oyente(items);
    return () => oyentes.delete(oyente);
}

export function agregar(producto, cantidad = 1) {
    const resultado = agregarItem(items, producto, cantidad);
    if (resultado.items !== items) actualizar(resultado.items);
    return resultado.limitado ? 'limite' : 'ok';
}

export const cambiar = (id, cantidad) => actualizar(cambiarCantidad(items, id, cantidad));
export const quitar = id => actualizar(quitarItem(items, id));
export const vaciar = () => actualizar([]);

window.addEventListener('storage', evento => {
    if (evento.key === CONFIG.claveCarrito) {
        items = leerCarrito();
        avisar();
    }
});
