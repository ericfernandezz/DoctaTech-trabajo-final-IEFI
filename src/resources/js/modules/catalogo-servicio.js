// ACCESO A DATOS del catálogo: pide el JSON con fetch y maneja los errores con try/catch.
import { CONFIG } from '../config.js';

const MENSAJE_ERROR = 'No pudimos cargar el catálogo. Revisá tu conexión e intentá nuevamente.';

export async function cargarProductos(url = CONFIG.urlProductos) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Respuesta HTTP ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        if (!Array.isArray(datos)) {
            throw new Error('El catálogo no tiene el formato esperado.');
        }
        return datos;
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        throw new Error(MENSAJE_ERROR);
    }
}
