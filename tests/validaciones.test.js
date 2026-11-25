import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    validarNombre, validarEmail, validarTelefono, validarCodigoPostal, validarCantidad,
    validarFormulario
} from '../src/resources/js/modules/validaciones.js';
import { reglasCheckout, reglasContacto } from '../src/resources/js/modules/reglas-formularios.js';

test('validarNombre', () => {
    assert.equal(validarNombre('María José'), '');
    assert.match(validarNombre(''), /obligatorio/);
    assert.match(validarNombre('A'), /al menos 2/);
    assert.match(validarNombre('Juan123'), /letras/);
});

test('validarEmail', () => {
    assert.equal(validarEmail('ana@correo.com'), '');
    assert.match(validarEmail('ana@correo'), /válido/);
    assert.match(validarEmail(' '), /obligatorio/);
});

test('validarTelefono', () => {
    assert.equal(validarTelefono('351 555-1234'), '');
    assert.equal(validarTelefono('', { obligatorio: false }), '');
    assert.match(validarTelefono('123'), /entre 8 y 15/);
    assert.match(validarTelefono('abc12345'), /solo puede/);
});

test('validarCodigoPostal acepta 4 dígitos o formato CPA', () => {
    assert.equal(validarCodigoPostal('5000'), '');
    assert.equal(validarCodigoPostal('X5000ABC'), '');
    assert.match(validarCodigoPostal('50'), /válido/);
});

test('validarCantidad', () => {
    assert.equal(validarCantidad('3', 10), '');
    assert.match(validarCantidad('0', 10), /mínima/);
    assert.match(validarCantidad('11', 10), /máxima/);
    assert.match(validarCantidad('1.5', 10), /entera/);
    assert.match(validarCantidad('', 10), /entera/);
});

const datosCheckout = {
    nombre: 'Ana', apellido: 'Pérez', email: 'ana@correo.com', telefono: '3515551234',
    entrega: 'retiro', pago: 'transferencia', terminos: 'on'
};

test('checkout con retiro no exige dirección', () => {
    assert.equal(validarFormulario(datosCheckout, reglasCheckout()).valido, true);
});

test('checkout con envío exige dirección, ciudad y código postal', () => {
    const { valido, errores } = validarFormulario({ ...datosCheckout, entrega: 'envio' }, reglasCheckout());
    assert.equal(valido, false);
    assert.deepEqual(Object.keys(errores).sort(), ['ciudad', 'codigoPostal', 'direccion']);
});

test('checkout exige aceptar los términos', () => {
    const { errores } = validarFormulario({ ...datosCheckout, terminos: undefined }, reglasCheckout());
    assert.ok(errores.terminos);
});

test('contacto: mensaje corto y motivo vacío son inválidos', () => {
    const { errores } = validarFormulario(
        { nombre: 'Ana', apellido: 'Paz', email: 'a@b.co', telefono: '', motivo: '', mensaje: 'hola' },
        reglasContacto()
    );
    assert.deepEqual(Object.keys(errores).sort(), ['mensaje', 'motivo']);
});
