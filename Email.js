// Primero incluye EmailJS en tu HTML justo antes de cerrar el </head>
// <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// Inicialización de EmailJS - pon esto al inicio de tu script.js
(function() {
    emailjs.init("H7gTT_HYNPMcMEUK7"); // Reemplaza con tu public key de EmailJS
})();

// Función para enviar confirmación de asistencia
function confirmAttendance(isAttending) {
    if (state.hasConfirmed) {
        showMessage('Ya has confirmado tu asistencia anteriormente.', 'warning');
        return;
    }

    const templateParams = {
        guest_name: state.currentGuest.name,
        guest_phone: state.currentGuest.phone || 'No proporcionado',
        attendance: isAttending ? 'Asistirá' : 'No asistirá',
        date: new Date().toLocaleString(),
        to_email: 'jesusguerrapineda000@gmail.com' // Reemplaza con tu correo
    };

    emailjs.send('service_mz1odfs', 'template_fwt8bwp', templateParams)
        .then(() => {
            const message = isAttending
                ? `¡Gracias por confirmar, ${state.currentGuest.name}! Nos vemos el 30 de noviembre.`
                : `Lamentamos que no puedas asistir, ${state.currentGuest.name}.`;
            showMessage(message, isAttending ? 'success' : 'info');
            state.hasConfirmed = true;

            // Deshabilitar botones después de confirmar
            const buttons = document.querySelectorAll('#attendance button');
            buttons.forEach(button => button.disabled = true);
        })
        .catch((error) => {
            showMessage('Error al confirmar asistencia. Por favor, intenta nuevamente.', 'error');
            console.error('Error:', error);
        });
}

// Función para enviar mensajes
function saveMessage() {
    if (state.messagesSent >= CONFIG.MAX_MESSAGES_PER_GUEST) {
        showMessage('Has alcanzado el límite de mensajes permitidos.', 'warning');
        return;
    }

    const messageTextarea = document.getElementById('guest-message');
    const message = messageTextarea?.value.trim();

    if (!message) {
        showMessage('Por favor, escribe un mensaje antes de enviar.', 'warning');
        return;
    }

    const templateParams = {
        guest_name: state.currentGuest.name,
        guest_phone: state.currentGuest.phone || 'No proporcionado',
        message: message,
        date: new Date().toLocaleString(),
        to_email: 'jesusguerrapineda000@gmail.com' // Reemplaza con tu correo
    };

    emailjs.send('service_mz1odfs', 'template_ew68oxw', templateParams)
        .then(() => {
            showMessageSent();
            messageTextarea.value = '';
            updateCharCount({ target: messageTextarea });
            state.messagesSent++;
        })
        .catch((error) => {
            showMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
            console.error('Error al enviar mensaje:', error);
        });
}