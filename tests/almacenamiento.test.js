import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerJSON, guardarJSON } from '../src/resources/js/modules/almacenamiento.js';
import { guardarUltimoPedido, leerUltimoPedido } from '../src/resources/js/modules/pedidos-persistencia.js';

const storageFalso = () => {
    const datos = {};
    return { getItem: k => datos[k] ?? null, setItem: (k, v) => { datos[k] = v; } };
};

test('guardarJSON y leerJSON hacen ida y vuelta', () => {
    const storage = storageFalso();
    assert.equal(guardarJSON('a', { x: 1 }, storage), true);
    assert.deepEqual(leerJSON('a', null, storage), { x: 1 });
});

test('leerJSON devuelve el valor por defecto si no existe o está corrupto', () => {
    const storage = storageFalso();
    assert.equal(leerJSON('nada', 'defecto', storage), 'defecto');
    storage.setItem('roto', '{no es json');
    assert.deepEqual(leerJSON('roto', [], storage), []);
});

test('guardarJSON devuelve false si no hay storage', () => {
    assert.equal(guardarJSON('a', 1, null), false);
});

test('el último pedido se guarda y se recupera', () => {
    const storage = storageFalso();
    guardarUltimoPedido({ numero: 'DT-1' }, storage);
    assert.equal(leerUltimoPedido(storage).numero, 'DT-1');
    assert.equal(leerUltimoPedido(storageFalso()), null);
});
