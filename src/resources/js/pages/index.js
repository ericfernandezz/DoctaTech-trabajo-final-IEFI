// Página de inicio: catálogo con búsqueda, filtros y orden.
import { iniciarComun } from '../modules/comun.js';
import { cargarProductos } from '../modules/catalogo-servicio.js';
import { filtrarProductos, ordenarProductos, valoresUnicos } from '../modules/catalogo.js';
import { renderizarCatalogo } from '../modules/vistas.js';
import { registrarCatalogo } from '../modules/carrito-ui.js';
import { escaparHTML } from '../modules/utils.js';

const contenedor = document.getElementById('contenedor-productos');
const formulario = document.getElementById('filtros');
const buscador = document.getElementById('buscar-producto');
const resultados = document.getElementById('resultados-catalogo');
const errorPrecio = document.getElementById('error-precio');

const MENSAJE_RANGO_INVALIDO = 'El precio mínimo no puede ser mayor que el máximo.';

let productos = [];
let ultimaClave = '';

const aNumeroONulo = valor => (valor.trim() === '' || Number.isNaN(Number(valor)) ? null : Number(valor));

function llenarSelect(select, valores) {
    valores.forEach(valor =>
        select.insertAdjacentHTML('beforeend', `<option value="${escaparHTML(valor)}">${escaparHTML(valor)}</option>`)
    );
}

function leerFiltros() {
    let precioMin = aNumeroONulo(formulario.elements.precioMin.value);
    let precioMax = aNumeroONulo(formulario.elements.precioMax.value);
    let error = '';

    if (precioMin !== null && precioMax !== null && precioMin > precioMax) {
        error = MENSAJE_RANGO_INVALIDO;
        precioMin = null;
        precioMax = null;
    }

    return {
        filtros: {
            texto: buscador.value,
            categoria: formulario.elements.categoria.value,
            marca: formulario.elements.marca.value,
            precioMin,
            precioMax
        },
        orden: formulario.elements.orden.value,
        error
    };
}

function mostrarResultados(filtrados) {
    renderizarCatalogo(contenedor, filtrados);
    resultados.textContent = `Mostrando ${filtrados.length} de ${productos.length} productos.`;
}

function aplicarFiltros() {
    const { filtros, orden, error } = leerFiltros();
    errorPrecio.textContent = error;

   
    const clave = JSON.stringify([filtros, orden]);
    if (clave === ultimaClave) return;
    ultimaClave = clave;

    mostrarResultados(ordenarProductos(filtrarProductos(productos, filtros), orden));
}

function cargarOpcionesDeFiltros() {
    llenarSelect(formulario.elements.categoria, valoresUnicos(productos, 'categoria'));
    llenarSelect(formulario.elements.marca, valoresUnicos(productos, 'marca'));
}

function aplicarBusquedaDeLaUrl() {
    const busqueda = new URLSearchParams(window.location.search).get('buscar');
    if (busqueda) buscador.value = busqueda;
}

function conectarEventos() {
    formulario.addEventListener('input', aplicarFiltros);
    formulario.addEventListener('change', aplicarFiltros);
    formulario.addEventListener('submit', evento => evento.preventDefault());
    formulario.addEventListener('reset', () => {
        buscador.value = '';
        setTimeout(aplicarFiltros); //termina de limpiar los campos
    });
    buscador.addEventListener('input', aplicarFiltros);
}

function mostrarErrorDeCarga(error) {
    contenedor.innerHTML = `<p class="mensaje-error" role="alert">${escaparHTML(error.message)}</p>`;
    resultados.textContent = '';
}

// Proceso principal de la página: se llama una sola vez al final del archivo.
async function iniciarCatalogo() {
    iniciarComun();
    conectarEventos();

    try {
        productos = await cargarProductos();
    } catch (error) {
        mostrarErrorDeCarga(error);
        return;
    }

    registrarCatalogo(productos);
    cargarOpcionesDeFiltros();
    aplicarBusquedaDeLaUrl();
    aplicarFiltros();
}

iniciarCatalogo();
