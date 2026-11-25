
import { calcularTotal, calcularUnidades } from './carrito.js';
import { formatearPrecio } from './utils.js';
import { plantillaItemCarrito } from './vistas.js';

const PLANTILLA_PANEL = `
    <div class="fondo-carrito" id="fondo-carrito"></div>
    <aside class="panel-carrito" id="panel-carrito" role="dialog" aria-modal="true" aria-labelledby="titulo-carrito">
        <div class="panel-carrito-cabecera">
            <h2 id="titulo-carrito">Tu carrito</h2>
            <button class="panel-carrito-cerrar" type="button" data-cerrar-carrito aria-label="Cerrar carrito">&#10005;</button>
        </div>
        <p class="carrito-vacio" id="carrito-vacio">Tu carrito está vacío.</p>
        <ul class="carrito-lista" id="carrito-lista"></ul>
        <div class="resumen-carrito" id="carrito-resumen">
            <p class="texto-total">Total de la compra</p>
            <p class="importe-total" id="carrito-total">$0</p>
        </div>
        <div class="acciones-carrito">
            <a class="boton" id="carrito-finalizar" href="checkout.html">Finalizar compra</a>
            <a class="boton boton-secundario" href="index.html#catalogo" data-cerrar-carrito>Seguir comprando</a>
            <button class="boton boton-peligro" id="carrito-vaciar" type="button" data-vaciar-carrito>Vaciar carrito</button>
        </div>
    </aside>
`;

let ultimoFoco = null;

export function montarPanelCarrito() {
    if (document.getElementById('panel-carrito')) return;
    document.body.insertAdjacentHTML('beforeend', PLANTILLA_PANEL);
}

export function renderizarCarrito(items) {
    const unidades = calcularUnidades(items);
    const vacio = items.length === 0;
    const contador = document.getElementById('contador-carrito');
    const botonAbrir = document.querySelector('[data-abrir-carrito]');

    if (contador) {
        contador.textContent = unidades;
        contador.hidden = vacio;
    }
    botonAbrir?.setAttribute('aria-label', vacio ? 'Abrir carrito (vacío)' : `Abrir carrito (${unidades} unidades)`);

    document.getElementById('carrito-vacio').hidden = !vacio;
    document.getElementById('carrito-lista').hidden = vacio;
    document.getElementById('carrito-resumen').hidden = vacio;
    document.getElementById('carrito-finalizar').hidden = vacio;
    document.getElementById('carrito-vaciar').hidden = vacio;

    document.getElementById('carrito-lista').innerHTML = items.map(plantillaItemCarrito).join('');
    document.getElementById('carrito-total').textContent = formatearPrecio(calcularTotal(items));
}

export function alternarPanel(abrir) {
    const panel = document.getElementById('panel-carrito');
    const fondo = document.getElementById('fondo-carrito');
    const botonAbrir = document.querySelector('[data-abrir-carrito]');
    if (!panel) return;

    const estadoAbierto = typeof abrir === 'boolean' ? abrir : !panel.classList.contains('abierto');
    panel.classList.toggle('abierto', estadoAbierto);
    fondo.classList.toggle('abierto', estadoAbierto);
    botonAbrir?.setAttribute('aria-expanded', String(estadoAbierto));
    document.body.classList.toggle('carrito-abierto', estadoAbierto);

    if (estadoAbierto) {
        ultimoFoco = document.activeElement;
        panel.querySelector('.panel-carrito-cerrar').focus();
    } else {
        ultimoFoco?.focus?.();
    }
}
