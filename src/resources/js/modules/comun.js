// Inicialización común a todas las páginas: carrito, buscador del encabezado y año del pie.
import { montarPanelCarrito } from './vista-carrito.js';
import { iniciarCarritoUI } from './carrito-ui.js';

const PAGINA_CATALOGO = 'index.html';

function iniciarBuscadorGlobal() {
    const formulario = document.querySelector('.buscador');
    const campo = document.getElementById('buscar-producto');
    if (!formulario || !campo) return;

    const estaEnCatalogo = Boolean(document.getElementById('contenedor-productos'));
    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        // En las demás páginas, buscar lleva al catálogo con la búsqueda ya aplicada.
        if (!estaEnCatalogo) {
            const texto = campo.value.trim();
            window.location.href = `${PAGINA_CATALOGO}${texto ? `?buscar=${encodeURIComponent(texto)}` : ''}#catalogo`;
        }
    });
}

function mostrarAnioActual() {
    document.querySelectorAll('[data-anio]').forEach(elemento => {
        elemento.textContent = new Date().getFullYear();
    });
}

export function iniciarComun() {
    montarPanelCarrito();
    iniciarCarritoUI();
    iniciarBuscadorGlobal();
    mostrarAnioActual();
}
