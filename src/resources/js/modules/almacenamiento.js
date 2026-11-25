// Acceso genérico a localStorage. Es la ÚNICA capa que toca el storage:
// el resto de los módulos de persistencia la usan y no repiten try/catch ni JSON.parse.

export function obtenerStorage() {
    try {
        return globalThis.localStorage ?? null;
    } catch {
        return null; // por ejemplo, navegación privada o cookies bloqueadas
    }
}

export function leerJSON(clave, porDefecto = null, storage = obtenerStorage()) {
    try {
        const crudo = storage?.getItem(clave);
        return crudo ? JSON.parse(crudo) : porDefecto;
    } catch {
        return porDefecto; // JSON corrupto
    }
}

export function guardarJSON(clave, valor, storage = obtenerStorage()) {
    try {
        storage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch {
        return false; // cuota excedida o storage no disponible
    }
}
