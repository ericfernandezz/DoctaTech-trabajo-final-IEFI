import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agregarItem, cambiarCantidad, quitarItem, calcularTotal, calcularUnidades } from '../src/resources/js/modules/carrito.js';
import { leerCarrito, guardarCarrito } from '../src/resources/js/modules/carrito-persistencia.js';
import { CONFIG } from '../src/resources/js/config.js';

const mouse = { id: 1, nombre: 'Mouse', precio: 1000, imagen: '', stock: 5 };
const teclado = { id: 2, nombre: 'Teclado', precio: 2500, imagen: '', stock: 20 };

const storageFalso = (inicial = {}) => {
    const datos = { ...inicial };
    return { getItem: k => datos[k] ?? null, setItem: (k, v) => { datos[k] = v; } };
};

test('agregarItem suma cantidades sin duplicar productos', () => {
    let { items } = agregarItem([], mouse, 1);
    ({ items } = agregarItem(items, mouse, 2));
    assert.equal(items.length, 1);
    assert.equal(items[0].cantidad, 3);
});

test('agregarItem respeta el stock y el máximo por producto', () => {
    const lleno = agregarItem([], mouse, 99);
    assert.equal(lleno.items[0].cantidad, 5);
    assert.equal(lleno.limitado, true);
    assert.equal(agregarItem([], teclado, 99).items[0].cantidad, CONFIG.maxPorProducto);
});

test('agregarItem no modifica el array original (inmutabilidad)', () => {
    const original = [];
    agregarItem(original, mouse, 1);
    assert.equal(original.length, 0);
});

test('cambiarCantidad y quitarItem', () => {
    const { items } = agregarItem([], mouse, 2);
    assert.equal(cambiarCantidad(items, 1, 4)[0].cantidad, 4);
    assert.equal(cambiarCantidad(items, 1, 50)[0].cantidad, 5);
    assert.equal(cambiarCantidad(items, 1, 0).length, 0);
    assert.equal(quitarItem(items, 1).length, 0);
});

test('calcularTotal y calcularUnidades', () => {
    let { items } = agregarItem([], mouse, 2);
    ({ items } = agregarItem(items, teclado, 1));
    assert.equal(calcularTotal(items), 4500);
    assert.equal(calcularUnidades(items), 3);
});

test('guardarCarrito y leerCarrito persisten en el storage', () => {
    const storage = storageFalso();
    const { items } = agregarItem([], mouse, 2);
    assert.equal(guardarCarrito(items, storage), true);
    assert.deepEqual(leerCarrito(storage), items);
});

test('leerCarrito tolera JSON corrupto o datos inválidos', () => {
    assert.deepEqual(leerCarrito(storageFalso({ [CONFIG.claveCarrito]: '{no es json' })), []);
    assert.deepEqual(leerCarrito(storageFalso({ [CONFIG.claveCarrito]: '[{"id":"x"}]' })), []);
    assert.deepEqual(leerCarrito(null), []);
});
