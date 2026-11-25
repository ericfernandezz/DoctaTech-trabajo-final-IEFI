
import { suscribir, agregar, cambiar, quitar, vaciar, obtenerItems } from './carrito-estado.js';
import { renderizarCarrito, alternarPanel } from './vista-carrito.js';
import { aEntero } from './utils.js';
import { notificar } from './notificaciones.js';

let catalogo = [];

export const registrarCatalogo = productos => {
    catalogo = productos;
};

export function agregarConAviso(producto, cantidad = 1) {
    const resultado = agregar(producto, cantidad);
    if (resultado === 'limite') {
        notificar(`Alcanzaste el máximo disponible de "${producto.nombre}".`, 'aviso');
    } else {
        notificar(`"${producto.nombre}" se agregó al carrito.`, 'exito');
    }
    return resultado;
}

const idDe = (objetivo, atributo) => aEntero(objetivo.closest(`[${atributo}]`)?.getAttribute(atributo), -1);
const cantidadDe = id => obtenerItems().find(item => item.id === id)?.cantidad ?? 0;

function manejarClick(evento) {
    const objetivo = evento.target;

    if (objetivo.closest('[data-abrir-carrito]')) return alternarPanel();
    if (objetivo.closest('[data-cerrar-carrito]') || objetivo.id === 'fondo-carrito') return alternarPanel(false);

    const botonAgregar = objetivo.closest('[data-agregar-id]');
    if (botonAgregar) {
        const producto = catalogo.find(item => item.id === aEntero(botonAgregar.dataset.agregarId));
        if (producto) agregarConAviso(producto, 1);
        return;
    }

    if (objetivo.closest('[data-cantidad-mas]')) {
        const id = idDe(objetivo, 'data-cantidad-mas');
        cambiar(id, cantidadDe(id) + 1);
    } else if (objetivo.closest('[data-cantidad-menos]')) {
        const id = idDe(objetivo, 'data-cantidad-menos');
        cambiar(id, cantidadDe(id) - 1);
    } else if (objetivo.closest('[data-eliminar-id]')) {
        quitar(idDe(objetivo, 'data-eliminar-id'));
    } else if (objetivo.closest('[data-vaciar-carrito]')) {
        vaciar();
        notificar('Vaciaste el carrito.', 'info');
    }
}

const manejarTeclado = evento => {
    if (evento.key === 'Escape') alternarPanel(false);
};

export function iniciarCarritoUI() {
    suscribir(renderizarCarrito);
    document.addEventListener('click', manejarClick);
    document.addEventListener('keydown', manejarTeclado);
}
