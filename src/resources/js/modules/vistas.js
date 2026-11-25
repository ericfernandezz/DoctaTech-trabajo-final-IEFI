// Plantillas HTML: convierten datos en marcado. Todo texto dinámico pasa por escaparHTML.
import { escaparHTML, formatearPrecio } from './utils.js';
import { estadoStock } from './catalogo.js';
import { calcularSubtotal } from './carrito.js';

export function plantillaTarjeta(producto) {
    const stock = estadoStock(producto.stock);
    const nombre = escaparHTML(producto.nombre);
    return `
        <article class="producto">
            <a class="producto-imagen" href="producto.html?id=${producto.id}" aria-label="Ver detalle de ${nombre}">
                <img src="${escaparHTML(producto.imagen)}" alt="${nombre}" loading="lazy" />
            </a>
            <p class="producto-meta">${escaparHTML(producto.marca)} · ${escaparHTML(producto.categoria)}</p>
            <h3>${nombre}</h3>
            <p>${escaparHTML(producto.descripcion)}</p>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
            <span class="stock ${stock.clase}">${stock.texto}</span>
            <div class="producto-acciones">
                <a class="boton boton-secundario" href="producto.html?id=${producto.id}">Ver detalle</a>
                <button class="boton" type="button" data-agregar-id="${producto.id}"
                    aria-label="Agregar ${nombre} al carrito" ${stock.agotado ? 'disabled' : ''}>Agregar</button>
            </div>
        </article>
    `;
}

export function renderizarCatalogo(contenedor, productos) {
    if (!contenedor) return;
    contenedor.innerHTML =
        productos.length === 0
            ? '<p class="sin-productos">No encontramos productos con esos filtros. Probá con otra búsqueda.</p>'
            : productos.map(plantillaTarjeta).join('');
}

export function plantillaItemCarrito(item) {
    const nombre = escaparHTML(item.nombre);
    return `
        <li class="carrito-item">
            <img src="${escaparHTML(item.imagen)}" alt="" width="56" height="56" />
            <div class="carrito-item-info">
                <p class="carrito-item-nombre">${nombre}</p>
                <p class="carrito-item-precio">${formatearPrecio(item.precio)} c/u</p>
                <div class="cantidad-control" role="group" aria-label="Cantidad de ${nombre}">
                    <button type="button" data-cantidad-menos="${item.id}" aria-label="Quitar una unidad de ${nombre}">&minus;</button>
                    <span>${item.cantidad}</span>
                    <button type="button" data-cantidad-mas="${item.id}" aria-label="Agregar una unidad de ${nombre}"
                        ${item.cantidad >= item.stock ? 'disabled' : ''}>+</button>
                </div>
            </div>
            <div class="carrito-item-lado">
                <strong>${formatearPrecio(calcularSubtotal(item))}</strong>
                <button class="boton-eliminar" type="button" data-eliminar-id="${item.id}"
                    aria-label="Quitar ${nombre} del carrito">&#10005;</button>
            </div>
        </li>
    `;
}

export function plantillaFicha(producto) {
    return Object.entries(producto.especificaciones ?? {})
        .map(([nombre, valor]) => `<tr><th scope="row">${escaparHTML(nombre)}</th><td>${escaparHTML(valor)}</td></tr>`)
        .join('');
}
