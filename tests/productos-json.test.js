import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../src/', import.meta.url));
const productos = JSON.parse(readFileSync(`${raiz}resources/data/productos.json`, 'utf8'));

test('el catálogo JSON tiene ids únicos y campos obligatorios', () => {
    assert.ok(productos.length >= 6);
    assert.equal(new Set(productos.map(p => p.id)).size, productos.length);
    for (const p of productos) {
        for (const campo of ['nombre', 'marca', 'categoria', 'imagen', 'descripcion']) {
            assert.ok(typeof p[campo] === 'string' && p[campo].length > 0, `${p.id}: falta ${campo}`);
        }
        assert.ok(p.precio > 0, `${p.id}: precio inválido`);
        assert.ok(Number.isInteger(p.stock) && p.stock >= 0, `${p.id}: stock inválido`);
        assert.ok(Object.keys(p.especificaciones).length >= 3, `${p.id}: faltan especificaciones`);
    }
});

test('cada producto tiene una imagen propia que existe en disco', () => {
    assert.equal(new Set(productos.map(p => p.imagen)).size, productos.length, 'hay imágenes repetidas');
    for (const p of productos) assert.ok(existsSync(raiz + p.imagen.replace('./', '')), `no existe ${p.imagen}`);
});
