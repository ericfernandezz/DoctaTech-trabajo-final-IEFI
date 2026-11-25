// RENDERIZADO de la confirmación del pedido (solo arma el HTML; no decide ni guarda nada).
import { escaparHTML, formatearPrecio } from './utils.js';
import { ENTREGAS, PAGOS } from './pedidos.js';

export function plantillaConfirmacion(pedido, urlGmail, urlMailto) {
    const filas = pedido.items
        .map(
            item => `<li>${item.cantidad} x ${escaparHTML(item.nombre)} <strong>${formatearPrecio(item.precio * item.cantidad)}</strong></li>`
        )
        .join('');
    const direccion = pedido.direccion
        ? `<p><strong>Dirección:</strong> ${escaparHTML(pedido.direccion.calle)}, ${escaparHTML(pedido.direccion.ciudad)} (CP ${escaparHTML(pedido.direccion.codigoPostal)})</p>`
        : '';

    return `
        <h1 tabindex="-1" id="titulo-confirmacion">¡Pedido registrado!</h1>
        <p class="numero-pedido">Número de pedido: <strong>${escaparHTML(pedido.numero)}</strong></p>
        <p>Gracias, ${escaparHTML(pedido.cliente.nombre)}. <strong>Último paso:</strong> enviá el pedido por Gmail para que DoctaTech lo confirme y coordine el pago y la entrega.</p>
        <ul class="lista-confirmacion">${filas}</ul>
        <p class="importe-total">Total: ${formatearPrecio(pedido.total)}</p>
        <p><strong>Entrega:</strong> ${escaparHTML(ENTREGAS[pedido.entrega])}</p>
        ${direccion}
        <p><strong>Pago:</strong> ${escaparHTML(PAGOS[pedido.pago])}</p>
        <div class="acciones-carrito">
            <a class="boton" id="enviar-gmail" href="${escaparHTML(urlGmail)}" target="_blank" rel="noopener noreferrer">Enviar pedido por Gmail</a>
            <a class="boton boton-secundario" id="enviar-mailto" href="${escaparHTML(urlMailto)}">Usar otro correo</a>
            <a class="boton boton-secundario" href="index.html">Volver a la tienda</a>
        </div>`;
}
