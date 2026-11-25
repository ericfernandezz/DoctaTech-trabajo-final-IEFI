// REGLAS DE NEGOCIO del carrito: funciones PURAS que reciben un array y devuelven uno nuevo.
// No tocan el DOM ni el storage, por eso se pueden probar con node:test.
import { CONFIG } from '../config.js';

export const limiteDe = producto =>
    Math.max(0, Math.min(CONFIG.maxPorProducto, Number.isFinite(producto.stock) ? producto.stock : CONFIG.maxPorProducto));

export function agregarItem(items, producto, cantidad = 1) {
    const limite = limiteDe(producto);
    const pedida = Math.max(1, Math.trunc(Number(cantidad)) || 1);
    const existente = items.find(item => item.id === producto.id);
    const actual = existente ? existente.cantidad : 0;
    const nueva = Math.min(actual + pedida, limite);
    const limitado = actual + pedida > limite;

    if (nueva === actual) return { items, limitado: true };

    const nuevos = existente
        ? items.map(item => (item.id === producto.id ? { ...item, cantidad: nueva } : item))
        : [
              ...items,
              {
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagen: producto.imagen,
                  stock: limite,
                  cantidad: nueva
              }
          ];
    return { items: nuevos, limitado };
}

export const quitarItem = (items, id) => items.filter(item => item.id !== id);

export function cambiarCantidad(items, id, cantidad) {
    if (cantidad <= 0) return quitarItem(items, id);
    return items.map(item => (item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item));
}

export const calcularSubtotal = item => item.precio * item.cantidad;
export const calcularTotal = items => items.reduce((acc, item) => acc + calcularSubtotal(item), 0);
export const calcularUnidades = items => items.reduce((acc, item) => acc + item.cantidad, 0);

export const esItemValido = item =>
    item !== null &&
    typeof item === 'object' &&
    Number.isInteger(item.id) &&
    typeof item.nombre === 'string' &&
    Number.isFinite(item.precio) &&
    item.precio >= 0 &&
    Number.isInteger(item.cantidad) &&
    item.cantidad >= 1;
