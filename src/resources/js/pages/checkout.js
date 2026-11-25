// Página de checkout: resumen del carrito, formulario validado y confirmación del pedido.
import { iniciarComun } from '../modules/comun.js';
import { CONFIG } from '../config.js';
import { suscribir, obtenerItems, vaciar } from '../modules/carrito-estado.js';
import { calcularTotal, calcularUnidades } from '../modules/carrito.js';
import { datosDelFormulario, mostrarErrores, activarValidacionEnVivo } from '../modules/formularios.js';
import { validarFormulario } from '../modules/validaciones.js';
import { reglasCheckout } from '../modules/reglas-formularios.js';
import { construirPedido } from '../modules/pedidos.js';
import { guardarUltimoPedido, leerUltimoPedido } from '../modules/pedidos-persistencia.js';
import { construirMensajePedido, construirAsuntoPedido, construirUrlGmail, construirUrlMailto } from '../modules/mensajes.js';
import { plantillaItemCarrito } from '../modules/vistas.js';
import { plantillaConfirmacion } from '../modules/vistas-pedido.js';
import { formatearPrecio } from '../modules/utils.js';
import { notificar } from '../modules/notificaciones.js';

const formulario = document.getElementById('form-checkout');
const seccionPedido = document.getElementById('checkout-pedido');
const seccionVacio = document.getElementById('checkout-vacio');
const seccionConfirmacion = document.getElementById('checkout-confirmacion');
const camposEnvio = document.getElementById('datos-envio');
const botonUltimoPedido = document.getElementById('ver-ultimo-pedido');
const reglas = reglasCheckout();

let confirmado = false;

function renderizarResumen(items) {
    document.getElementById('resumen-lista').innerHTML = items.map(plantillaItemCarrito).join('');
    document.getElementById('resumen-unidades').textContent = calcularUnidades(items);
    document.getElementById('resumen-total').textContent = formatearPrecio(calcularTotal(items));
}

function mostrarSeccion({ pedido = false, vacio = false, confirmacion = false }) {
    seccionPedido.hidden = !pedido;
    seccionVacio.hidden = !vacio;
    seccionConfirmacion.hidden = !confirmacion;
}

function mostrarCarritoVacio() {
    mostrarSeccion({ vacio: true });
    botonUltimoPedido.hidden = !leerUltimoPedido();
}

function mostrarConfirmacion(pedido) {
    const asunto = construirAsuntoPedido(pedido);
    const cuerpo = construirMensajePedido(pedido);
    const urlGmail = construirUrlGmail(CONFIG.emailTienda, asunto, cuerpo, pedido.cliente.email);
    const urlMailto = construirUrlMailto(CONFIG.emailTienda, asunto, cuerpo, pedido.cliente.email);
    seccionConfirmacion.innerHTML = plantillaConfirmacion(pedido, urlGmail, urlMailto);
    mostrarSeccion({ confirmacion: true });
    document.getElementById('titulo-confirmacion').focus();
}

// Se ejecuta cada vez que cambia el carrito.
function alCambiarElCarrito(items) {
    if (confirmado) return;
    if (items.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    mostrarSeccion({ pedido: true });
    renderizarResumen(items);
}

// Mostrar/ocultar los datos de envío (los campos ocultos se deshabilitan para no validarse).
function alternarCamposDeEnvio() {
    const esEnvio = formulario.elements.entrega.value === 'envio';
    camposEnvio.hidden = !esEnvio;
    camposEnvio.querySelectorAll('input').forEach(campo => {
        campo.disabled = !esEnvio;
        campo.required = esEnvio;
    });
}

function registrarPedido(datos, items) {
    const pedido = construirPedido(datos, items);
    guardarUltimoPedido(pedido);
    confirmado = true;
    vaciar();
    mostrarConfirmacion(pedido);
    return pedido;
}

function confirmarPedido(evento) {
    evento.preventDefault();
    const datos = datosDelFormulario(formulario);
    const { valido, errores } = validarFormulario(datos, reglas);

    if (!valido) {
        mostrarErrores(formulario, errores);
        notificar('Revisá los campos marcados en rojo.', 'error');
        return;
    }

    const items = obtenerItems();
    if (items.length === 0) {
        notificar('Tu carrito está vacío.', 'error');
        return;
    }

    try {
        const pedido = registrarPedido(datos, items);
        notificar(`¡Pedido ${pedido.numero} registrado! Enviálo por Gmail para confirmarlo.`, 'exito', 7000);
    } catch (error) {
        confirmado = false;
        console.error(error);
        notificar('No pudimos registrar el pedido. Intentá nuevamente.', 'error');
    }
}

function verUltimoPedido() {
    const ultimo = leerUltimoPedido();
    if (ultimo) mostrarConfirmacion(ultimo);
}

function conectarEventos() {
    formulario.addEventListener('change', evento => {
        if (evento.target.name === 'entrega') alternarCamposDeEnvio();
    });
    formulario.addEventListener('submit', confirmarPedido);
    botonUltimoPedido.addEventListener('click', verUltimoPedido);
}

function iniciarCheckout() {
    iniciarComun();
    alternarCamposDeEnvio();
    activarValidacionEnVivo(formulario, reglas);
    conectarEventos();
    suscribir(alCambiarElCarrito);
}

iniciarCheckout();
