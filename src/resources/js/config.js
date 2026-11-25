
export const CONFIG = Object.freeze({
    nombreTienda: 'DoctaTech',

    emailTienda: 'doctatechhardware@gmail.com',

    // Ruta del JSON
    urlProductos: new URL('../data/productos.json', import.meta.url).href,

    // Claves de localStorage (por si cambia el formato de los datos).
    claveCarrito: 'doctatech.carrito.v1',
    claveUltimoPedido: 'doctatech.ultimoPedido.v1',

    // Máximo de unidades de un mismo producto por compra.
    maxPorProducto: 10
});
