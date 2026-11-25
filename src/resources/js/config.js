// Configuración central de DoctaTech.
// Si algo del negocio cambia (mail, claves), se cambia SOLO acá.

export const CONFIG = Object.freeze({
    nombreTienda: 'DoctaTech',

    // IMPORTANTE: reemplazar por la casilla de Gmail real del negocio.
    // Los pedidos y consultas se envían a esta dirección.
    emailTienda: 'contacto.doctatech@gmail.com',

    // Ruta del JSON con el catálogo (relativa a este archivo, funciona en local y en Vercel).
    urlProductos: new URL('../data/productos.json', import.meta.url).href,

    // Claves de localStorage (con versión por si cambia el formato de los datos).
    claveCarrito: 'doctatech.carrito.v1',
    claveUltimoPedido: 'doctatech.ultimoPedido.v1',

    // Máximo de unidades de un mismo producto por compra.
    maxPorProducto: 10
});
