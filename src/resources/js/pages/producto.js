import { iniciarComun } from '../modules/comun.js';
import { cargarProductos } from '../modules/catalogo-servicio.js';
import { estadoStock, productosRelacionados } from '../modules/catalogo.js';
import { plantillaFicha, plantillaTarjeta } from '../modules/vistas.js';
import { registrarCatalogo, agregarConAviso } from '../modules/carrito-ui.js';
import { limiteDe } from '../modules/carrito.js';
import { validarCantidad } from '../modules/validaciones.js';
import { escaparHTML, formatearPrecio, aEntero } from '../modules/utils.js';
import { notificar } from '../modules/notificaciones.js';

const contenido = document.getElementById('contenido');

function mostrarError(mensaje) {
    contenido.innerHTML = `
        <section class="seccion">
            <h1>Producto no encontrado</h1>
            <p class="mensaje-error" role="alert">${escaparHTML(mensaje)}</p>
            <a class="boton" href="index.html#catalogo">Volver al catálogo</a>
        </section>`;
}

function mostrarProducto(producto, productos) {
    const stock = estadoStock(producto.stock);
    const limite = limiteDe(producto);
    const relacionados = productosRelacionados(productos, producto);

    document.title = `DoctaTech - ${producto.nombre}`;
    contenido.innerHTML = `
        <nav class="migas" aria-label="Ruta de navegación">
            <a href="index.html">Inicio</a> / <a href="index.html#catalogo">${escaparHTML(producto.categoria)}</a> / <span>${escaparHTML(producto.nombre)}</span>
        </nav>
        <article class="detalle-producto">
            <div class="detalle-imagen">
                <img src="${escaparHTML(producto.imagen)}" alt="${escaparHTML(producto.nombre)}" />
            </div>
            <div class="detalle-datos">
                <p class="producto-meta">${escaparHTML(producto.marca)} · ${escaparHTML(producto.categoria)}</p>
                <h1>${escaparHTML(producto.nombre)}</h1>
                <p class="precio">${formatearPrecio(producto.precio)}</p>
                <span class="stock ${stock.clase}">${stock.texto}</span>

                <section>
                    <h2>Descripción</h2>
                    <p>${escaparHTML(producto.descripcion)}</p>
                </section>

                <section>
                    <h2>Comprar producto</h2>
                    <form id="form-agregar" class="form-cantidad" novalidate>
                        <label for="cantidad">Cantidad:</label>
                        <input type="number" id="cantidad" name="cantidad" min="1" max="${limite}" value="1"
                            required inputmode="numeric" aria-describedby="error-cantidad" ${stock.agotado ? 'disabled' : ''} />
                        <button class="boton" type="submit" ${stock.agotado ? 'disabled' : ''}>Agregar al carrito</button>
                        <small class="error-campo" id="error-cantidad" role="alert"></small>
                    </form>
                </section>
            </div>
        </article>

        <section class="seccion">
            <h2>Ficha técnica</h2>
            <table class="tabla-ficha"><tbody>${plantillaFicha(producto)}</tbody></table>
        </section>

        ${
            relacionados.length
                ? `<section class="seccion"><h2>Productos relacionados</h2>
                   <div class="productos">${relacionados.map(plantillaTarjeta).join('')}</div></section>`
                : ''
        }

        <div class="acciones-producto">
            <a class="boton boton-secundario" href="index.html#catalogo">Volver al catálogo</a>
        </div>`;

    conectarFormularioCantidad(producto, limite);
}

function conectarFormularioCantidad(producto, limite) {
    const formulario = document.getElementById('form-agregar');
    const campo = document.getElementById('cantidad');
    const error = document.getElementById('error-cantidad');

    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        const mensaje = validarCantidad(campo.value, limite);
        error.textContent = mensaje;
        campo.toggleAttribute('aria-invalid', Boolean(mensaje));
        if (mensaje) {
            campo.focus();
            return;
        }
        agregarConAviso(producto, aEntero(campo.value, 1));
    });
}

// Proceso principal de la página: se llama una sola vez al final del archivo.
async function iniciarProducto() {
    iniciarComun();

    try {
        const productos = await cargarProductos();
        registrarCatalogo(productos);
        const id = aEntero(new URLSearchParams(window.location.search).get('id'), -1);
        const producto = productos.find(item => item.id === id);
        if (!producto) {
            mostrarError('El producto que buscás no existe o fue retirado del catálogo.');
            return;
        }
        mostrarProducto(producto, productos);
    } catch (error) {
        mostrarError(error.message);
        notificar('No se pudo cargar el producto.', 'error');
    }
}

iniciarProducto();
