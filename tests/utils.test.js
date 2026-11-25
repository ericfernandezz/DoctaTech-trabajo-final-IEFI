import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatearPrecio, escaparHTML, normalizarTexto, aEntero } from '../src/resources/js/modules/utils.js';

test('formatearPrecio usa separador de miles argentino', () => {
    assert.equal(formatearPrecio(25900), '$25.900');
    assert.equal(formatearPrecio(0), '$0');
});

test('escaparHTML neutraliza etiquetas y comillas', () => {
    assert.equal(escaparHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    assert.equal(escaparHTML(null), '');
});

test('normalizarTexto quita tildes y pasa a minúsculas', () => {
    assert.equal(normalizarTexto('  Periféricos '), 'perifericos');
});

test('aEntero devuelve el valor por defecto si no es número', () => {
    assert.equal(aEntero('7'), 7);
    assert.equal(aEntero('abc', -1), -1);
});
