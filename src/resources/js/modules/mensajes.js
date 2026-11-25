// MENSAJES de salida: asunto y texto del pedido/consulta, y enlaces a Gmail (funciones puras).
import { formatearPrecio } from './utils.js';
import { ENTREGAS, PAGOS } from './pedidos.js';

const URL_GMAIL = 'https://mail.google.com/mail/?view=cm&fs=1';

export function construirMensajePedido(pedido) {
    const lineas = [
        `Nuevo pedido DoctaTech - ${pedido.numero}`,
        '',
        `Cliente: ${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
        `Email: ${pedido.cliente.email}`,
        `Teléfono: ${pedido.cliente.telefono}`,
        '',
        'Productos:',
        ...pedido.items.map(
            item => `- ${item.cantidad} x ${item.nombre} (${formatearPrecio(item.precio * item.cantidad)})`
        ),
        '',
        `Total: ${formatearPrecio(pedido.total)}`,
        '',
        `Entrega: ${ENTREGAS[pedido.entrega] ?? pedido.entrega}`
    ];

    if (pedido.direccion) {
        lineas.push(
            `Dirección: ${pedido.direccion.calle}, ${pedido.direccion.ciudad} (CP ${pedido.direccion.codigoPostal})`
        );
    }
    lineas.push(`Pago: ${PAGOS[pedido.pago] ?? pedido.pago}`);
    if (pedido.observaciones) lineas.push(`Observaciones: ${pedido.observaciones}`);

    return lineas.join('\n');
}

export function construirMensajeContacto(datos) {
    const lineas = [
        'Consulta desde la web de DoctaTech',
        '',
        `Nombre: ${datos.nombre.trim()} ${datos.apellido.trim()}`,
        `Email: ${datos.email.trim()}`
    ];
    if (datos.telefono?.trim()) lineas.push(`Teléfono: ${datos.telefono.trim()}`);
    lineas.push(`Motivo: ${datos.motivo}`);
    if (datos.tipoProducto) lineas.push(`Producto de interés: ${datos.tipoProducto}`);
    lineas.push('', datos.mensaje.trim());
    return lineas.join('\n');
}

export const construirAsuntoPedido = pedido => `Nuevo pedido DoctaTech - ${pedido.numero}`;

export const construirAsuntoContacto = datos => `Consulta web - ${datos.motivo}`;

function armarParametros(destinatario, asunto, cuerpo, copia) {
    const partes = [`to=${encodeURIComponent(destinatario)}`];
    if (copia) partes.push(`cc=${encodeURIComponent(copia)}`);
    partes.push(`su=${encodeURIComponent(asunto)}`, `body=${encodeURIComponent(cuerpo)}`);
    return partes.join('&');
}

// Abre la redacción de Gmail con el mensaje listo (la copia va al cliente si se informa).
export function construirUrlGmail(destinatario, asunto, cuerpo, copia = '') {
    return `${URL_GMAIL}&${armarParametros(destinatario, asunto, cuerpo, copia)}`;
}

// Alternativa para quien no usa Gmail en el navegador: abre su programa de correo.
export function construirUrlMailto(destinatario, asunto, cuerpo, copia = '') {
    const partes = [];
    if (copia) partes.push(`cc=${encodeURIComponent(copia)}`);
    partes.push(`subject=${encodeURIComponent(asunto)}`, `body=${encodeURIComponent(cuerpo)}`);
    return `mailto:${destinatario}?${partes.join('&')}`;
}
