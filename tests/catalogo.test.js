import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrarProductos, ordenarProductos, valoresUnicos, productosRelacionados, estadoStock } from '../src/resources/js/modules/catalogo.js';
import { cargarProductos } from '../src/resources/js/modules/catalogo-servicio.js';

const productos = [
    { id: 1, nombre: 'Mouse Gamer', marca: 'Redragon', categoria: 'Periféricos', precio: 25900, descripcion: 'Sensor óptico' },
    { id: 2, nombre: 'Teclado Mecánico', marca: 'Redragon', categoria: 'Periféricos', precio: 49900, descripcion: 'RGB' },
    { id: 3, nombre: 'Notebook Gamer', marca: 'ASUS', categoria: 'Notebooks', precio: 129900, descripcion: 'Alto rendimiento' }
];

test('filtrarProductos por texto ignora tildes y mayúsculas', () => {
    assert.deepEqual(filtrarProductos(productos, { texto: 'PERIFERICOS' }).map(p => p.id), [1, 2]);
    assert.deepEqual(filtrarProductos(productos, { texto: 'mouse optico' }).map(p => p.id), [1]);
});

test('filtrarProductos combina categoría, marca y rango de precio', () => {
    assert.deepEqual(filtrarProductos(productos, { marca: 'ASUS' }).map(p => p.id), [3]);
    assert.deepEqual(filtrarProductos(productos, { categoria: 'Periféricos', precioMin: 30000 }).map(p => p.id), [2]);
    assert.deepEqual(filtrarProductos(productos, { precioMax: 25900 }).map(p => p.id), [1]);
    assert.deepEqual(filtrarProductos(productos, { texto: 'inexistente' }), []);
});

test('ordenarProductos no modifica el original', () => {
    const original = [...productos];
    assert.deepEqual(ordenarProductos(productos, 'precio-desc').map(p => p.id), [3, 2, 1]);
    assert.deepEqual(ordenarProductos(productos, 'precio-asc').map(p => p.id), [1, 2, 3]);
    assert.deepEqual(productos, original);
});

test('valoresUnicos y productosRelacionados', () => {
    assert.deepEqual(valoresUnicos(productos, 'marca'), ['ASUS', 'Redragon']);
    assert.deepEqual(productosRelacionados(productos, productos[0]).map(p => p.id), [2]);
});

test('estadoStock distingue disponible, bajo y agotado', () => {
    assert.equal(estadoStock(10).agotado, false);
    assert.equal(estadoStock(3).clase, 'stock-bajo');
    assert.equal(estadoStock(0).agotado, true);
});

test('cargarProductos maneja errores de red con try/catch', async () => {
    const fetchOriginal = globalThis.fetch;
    try {
        globalThis.fetch = async () => ({ ok: false, status: 500 });
        await assert.rejects(() => cargarProductos('x'), /No pudimos cargar el cat/);
        globalThis.fetch = async () => ({ ok: true, json: async () => productos });
        assert.equal((await cargarProductos('x')).length, 3);
    } finally {
        globalThis.fetch = fetchOriginal;
    }
});
