import { calcularTotal, calcularUnidades } from './carrito.js';

export const ENTREGAS = Object.freeze({
    retiro: 'Retiro en local (Córdoba Capital)',
    envio: 'Envío a domicilio (costo a coordinar)'
});

export const PAGOS = Object.freeze({
    transferencia: 'Transferencia bancaria',
    efectivo: 'Efectivo al retirar',
    mercadopago: 'Mercado Pago'
});

const dosDigitos = numero => String(numero).padStart(2, '0');

export function generarNumeroPedido(fecha = new Date(), aleatorio = Math.random) {
    const dia = `${fecha.getFullYear()}${dosDigitos(fecha.getMonth() + 1)}${dosDigitos(fecha.getDate())}`;
    const sufijo = Math.floor(aleatorio() * 9000) + 1000;
    return `DT-${dia}-${sufijo}`;
}

export function construirPedido(datos, items, fecha = new Date(), aleatorio = Math.random) {
    const esEnvio = datos.entrega === 'envio';
    return {
        numero: generarNumeroPedido(fecha, aleatorio),
        fecha: fecha.toISOString(),
        cliente: {
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            email: datos.email.trim(),
            telefono: datos.telefono.trim()
        },
        entrega: datos.entrega,
        direccion: esEnvio
            ? {
                  calle: datos.direccion.trim(),
                  ciudad: datos.ciudad.trim(),
                  codigoPostal: datos.codigoPostal.trim()
              }
            : null,
        pago: datos.pago,
        observaciones: (datos.observaciones ?? '').trim(),
        items: items.map(({ id, nombre, precio, cantidad }) => ({ id, nombre, precio, cantidad })),
        unidades: calcularUnidades(items),
        total: calcularTotal(items)
    };
}
