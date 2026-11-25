
export function notificar(mensaje, tipo = 'info', duracion = 4500) {
    let contenedor = document.getElementById('notificaciones');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificaciones';
        contenedor.className = 'notificaciones';
        contenedor.setAttribute('role', 'status');
        contenedor.setAttribute('aria-live', 'polite');
        document.body.append(contenedor);
    }

    const aviso = document.createElement('div');
    aviso.className = `toast toast-${tipo}`;
    aviso.textContent = mensaje;
    contenedor.append(aviso);

    setTimeout(() => aviso.remove(), duracion);
}
