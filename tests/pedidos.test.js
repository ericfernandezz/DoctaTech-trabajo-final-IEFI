import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarNumeroPedido, construirPedido } from '../src/resources/js/modules/pedidos.js';
import { construirMensajePedido, construirMensajeContacto, construirUrlGmail, construirUrlMailto, construirAsuntoPedido } from '../src/resources/js/modules/mensajes.js';

const items = [
    { id: 1, nombre: 'Mouse', precio: 1000, cantidad: 2, imagen: '', stock: 5 },
    { id: 2, nombre: 'Teclado', precio: 2500, cantidad: 1, imagen: '', stock: 5 }
];
const datos = {
    nombre: ' Ana ', apellido: 'Pérez', email: 'ana@correo.com', telefono: '3515551234',
    entrega: 'envio', direccion: 'Calle 123', ciudad: 'Córdoba', codigoPostal: '5000', pago: 'transferencia', observaciones: ''
};
const fecha = new Date(2026, 10, 25, 10, 0, 0);

test('generarNumeroPedido tiene fecha y sufijo de 4 dígitos', () => {
    assert.equal(generarNumeroPedido(fecha, () => 0), 'DT-20261125-1000');
    assert.match(generarNumeroPedido(fecha), /^DT-20261125-\d{4}$/);
});

test('construirPedido calcula total y limpia espacios', () => {
    const pedido = construirPedido(datos, items, fecha, () => 0);
    assert.equal(pedido.total, 4500);
    assert.equal(pedido.unidades, 3);
    assert.equal(pedido.cliente.nombre, 'Ana');
    assert.equal(pedido.direccion.codigoPostal, '5000');
});

test('construirPedido con retiro no incluye dirección', () => {
    assert.equal(construirPedido({ ...datos, entrega: 'retiro' }, items, fecha).direccion, null);
});

test('construirMensajePedido incluye número, productos y total', () => {
    const mensaje = construirMensajePedido(construirPedido(datos, items, fecha, () => 0));
    assert.match(mensaje, /DT-20261125-1000/);
    assert.match(mensaje, /2 x Mouse/);
    assert.match(mensaje, /Total: \$4\.500/);
    assert.match(mensaje, /Dirección: Calle 123/);
});

test('construirMensajeContacto omite teléfono vacío', () => {
    const mensaje = construirMensajeContacto({ nombre: 'Ana', apellido: 'P', email: 'a@b.co', telefono: '', motivo: 'Otro', mensaje: 'Hola, consulta' });
    assert.doesNotMatch(mensaje, /Teléfono/);
});

test('construirUrlGmail codifica asunto y cuerpo y agrega copia al cliente', () => {
    const url = construirUrlGmail('tienda@gmail.com', 'Pedido & más', 'Hola\nchau', 'cli@mail.com');
    assert.equal(url, 'https://mail.google.com/mail/?view=cm&fs=1&to=tienda%40gmail.com&cc=cli%40mail.com&su=Pedido%20%26%20m%C3%A1s&body=Hola%0Achau');
});

test('construirUrlMailto arma el enlace mailto con asunto y cuerpo', () => {
    const url = construirUrlMailto('tienda@gmail.com', 'Hola', 'Texto');
    assert.equal(url, 'mailto:tienda@gmail.com?subject=Hola&body=Texto');
});

test('construirAsuntoPedido incluye el número de pedido', () => {
    assert.equal(construirAsuntoPedido({ numero: 'DT-1' }), 'Nuevo pedido DoctaTech - DT-1');
});
