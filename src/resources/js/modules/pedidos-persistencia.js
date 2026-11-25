// PERSISTENCIA del último pedido confirmado.
import { CONFIG } from '../config.js';
import { leerJSON, guardarJSON, obtenerStorage } from './almacenamiento.js';

const CLAVE = CONFIG.claveUltimoPedido;

export const guardarUltimoPedido = (pedido, storage = obtenerStorage()) => guardarJSON(CLAVE, pedido, storage);
export const leerUltimoPedido = (storage = obtenerStorage()) => leerJSON(CLAVE, null, storage);
