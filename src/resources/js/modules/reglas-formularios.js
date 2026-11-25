// REGLAS por formulario: qué validador se aplica a cada campo (funciones puras).
import {
    validarNombre,
    validarEmail,
    validarTelefono,
    validarTextoLargo,
    validarCodigoPostal,
    validarSeleccion,
    validarAceptacion
} from './validaciones.js';

export const reglasContacto = () => ({
    nombre: valor => validarNombre(valor, 'El nombre'),
    apellido: valor => validarNombre(valor, 'El apellido'),
    email: validarEmail,
    telefono: valor => validarTelefono(valor, { obligatorio: false }),
    motivo: valor => validarSeleccion(valor, 'Elegí un motivo de contacto.'),
    mensaje: valor => validarTextoLargo(valor, 'El mensaje', { min: 10, max: 500 })
});

export const reglasCheckout = () => ({
    nombre: valor => validarNombre(valor, 'El nombre'),
    apellido: valor => validarNombre(valor, 'El apellido'),
    email: validarEmail,
    telefono: valor => validarTelefono(valor),
    entrega: valor => validarSeleccion(valor, 'Elegí cómo querés recibir tu pedido.'),
    direccion: (valor, datos) =>
        datos.entrega === 'envio' ? validarTextoLargo(valor, 'La dirección', { min: 5, max: 100 }) : '',
    ciudad: (valor, datos) =>
        datos.entrega === 'envio' ? validarTextoLargo(valor, 'La ciudad', { min: 2, max: 60 }) : '',
    codigoPostal: (valor, datos) => (datos.entrega === 'envio' ? validarCodigoPostal(valor) : ''),
    pago: valor => validarSeleccion(valor, 'Elegí un medio de pago.'),
    observaciones: valor => validarTextoLargo(valor, 'Las observaciones', { max: 300, obligatorio: false }),
    terminos: valor => validarAceptacion(valor === 'on', 'Tenés que aceptar los términos para continuar.')
});
