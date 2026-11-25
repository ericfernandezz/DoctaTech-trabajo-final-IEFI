// Página de contacto: valida el formulario y prepara la consulta para Gmail.
import { iniciarComun } from '../modules/comun.js';
import { CONFIG } from '../config.js';
import { datosDelFormulario, mostrarErrores, limpiarErrores, activarValidacionEnVivo } from '../modules/formularios.js';
import { validarFormulario } from '../modules/validaciones.js';
import { reglasContacto } from '../modules/reglas-formularios.js';
import { construirMensajeContacto, construirAsuntoContacto, construirUrlGmail, construirUrlMailto } from '../modules/mensajes.js';
import { notificar } from '../modules/notificaciones.js';

const formulario = document.getElementById('form-contacto');
const exito = document.getElementById('contacto-exito');
const enlaceGmail = document.getElementById('contacto-gmail');
const enlaceMailto = document.getElementById('contacto-mailto');
const botonNuevaConsulta = document.getElementById('contacto-nueva');
const reglas = reglasContacto();

function mostrarExito(datos) {
    const asunto = construirAsuntoContacto(datos);
    const cuerpo = construirMensajeContacto(datos);
    enlaceGmail.href = construirUrlGmail(CONFIG.emailTienda, asunto, cuerpo, datos.email.trim());
    enlaceMailto.href = construirUrlMailto(CONFIG.emailTienda, asunto, cuerpo, datos.email.trim());
    formulario.hidden = true;
    exito.hidden = false;
    exito.querySelector('h2').focus();
    formulario.reset();
    limpiarErrores(formulario);
}

function enviarConsulta(evento) {
    evento.preventDefault();
    const datos = datosDelFormulario(formulario);
    const { valido, errores } = validarFormulario(datos, reglas);

    if (!valido) {
        mostrarErrores(formulario, errores);
        notificar('Revisá los campos marcados en rojo.', 'error');
        return;
    }

    try {
        mostrarExito(datos);
        notificar('¡Consulta lista! Enviala por Gmail para que te respondamos.', 'exito');
    } catch (error) {
        console.error(error);
        notificar('No pudimos preparar tu consulta. Intentá nuevamente.', 'error');
    }
}

function volverAlFormulario() {
    exito.hidden = true;
    formulario.hidden = false;
    formulario.elements.nombre.focus();
}

function iniciarContacto() {
    iniciarComun();
    activarValidacionEnVivo(formulario, reglas);
    formulario.addEventListener('submit', enviarConsulta);
    botonNuevaConsulta?.addEventListener('click', volverAlFormulario);
}

iniciarContacto();
