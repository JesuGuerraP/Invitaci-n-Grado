// Configuración
const CONFIG = {
    LOAD_DELAY: 2000,
    GRADUATION_DATE: "2024-11-30T09:00:00",
    GOOGLE_SCRIPT_URL: "https://script.google.com/a/macros/unicartagena.edu.co/s/AKfycbxURRS52AtB1_d44n4pN1UHcCqlstxae7TghoJvAx_GWzNKVgDzfdgFapNtdxqf0WNY/exec",
    MAX_MESSAGE_LENGTH: 500,
    MAX_MESSAGES_PER_GUEST: 3,
    // Lista de invitados
    GUESTS: [
        { id: 1, name: "Aurysa Castro ", phone: "" },
        { id: 2, name: "Miguel Serrano", phone: "" },
        { id: 3, name: "Cesia Rodriguez", phone: "" },
        { id: 4, name: "Carolay Perez - Rafael Serrano", phone: "" },
        { id: 5, name: "Nancy Correa", phone: "" },
        { id: 6, name: "Luisandra Sanchez ", phone: "" },
        { id: 7, name: "Shaleima Bravo", phone: "" },
        { id: 8, name: "Paola Rodriguez - Pabla Pineda", phone: "" },
        { id: 9, name: "Frey Tirado - Mariel", phone: "" },
        { id: 10, name: "Marquesa Menco", phone: "" },
        { id: 11, name: "Luz Serpa", phone: "" },
        { id: 12, name: "Mario Garcias ", phone: "" },
        { id: 13, name: "Lourdes Mazo ", phone: "" },
        { id: 14, name: "José Berdecia", phone: "" },
        { id: 15, name: "Suegros", phone: "" },
        { id: 16, name: "Luis Guerra", phone: "" },
        { id: 17, name: "Carlos Cudris", phone: "" },
        { id: 18, name: "Anuar Guerra", phone: "" },
        { id: 19, name: "Gabriel Amaris", phone: "" },
        { id: 20, name: "Henry Troncoso", phone: "" },
        { id: 21, name: "José Vergara", phone: "" },
        { id: 22, name: "Wendy Pava❤️", phone: "" },
        { id: 23, name: "Cristian Guerra - Linda cuadrado", phone: "" },
        { id: 24, name: "Kevin Guerra ", phone: "" },
        { id: 25, name: "Dayana Obregon", phone: "" },
        { id: 26, name: "Padres💕", phone: "" },
        { id: 27, name: "Jhon Jader Rangel - Bertha Rangel", phone: "" },
        { id: 28, name: "Salim Morales", phone: "" },
        { id: 29, name: "Marian Montes", phone: "" },
        { id: 30, name: "Meraly Martinez", phone: "" },
        { id: 31, name: "Rosaura Muleth - Kevin", phone: "" },
        { id: 32, name: "Mauro Lopez - Mairo Lopez", phone: "" },
        { id: 33, name: "Jesús Piñeres", phone: "" },
        // Añade aquí todos tus invitados
    ]
};

// Estado de la aplicación
const state = {
    hasConfirmed: false,
    messagesSent: 0,
    currentGuest: null
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    populateGuestList();
});

function populateGuestList() {
    const guestList = document.getElementById('guest-list');
    if (!guestList) return;

    CONFIG.GUESTS.forEach(guest => {
        const option = document.createElement('option');
        option.value = guest.id;
        option.textContent = guest.name;
        guestList.appendChild(option);
    });
}

function initializeApp() {
    setTimeout(() => {
        showContent();
        displayGuestName();
        startCountdown();
    }, CONFIG.LOAD_DELAY);
}


function setupEventListeners() {
    const guestForm = document.getElementById('guest-form');
    const messageTextarea = document.getElementById('guest-message');

    guestForm?.addEventListener('submit', handleGuestSelection);
    messageTextarea?.addEventListener('input', updateCharCount);
}
function handleGuestSelection(event) {
    event.preventDefault();
    const guestId = document.getElementById('guest-list').value;
    const phone = document.getElementById('guest-phone').value.trim();
    
    if (!guestId) {
        showMessage('Por favor selecciona tu nombre de la lista', 'warning');
        return;
    }
    
    const selectedGuest = CONFIG.GUESTS.find(g => g.id === parseInt(guestId));
    if (!selectedGuest) return;
    
    // Actualizar el teléfono si se proporcionó
    if (phone) {
        selectedGuest.phone = phone;
    }
    
    state.currentGuest = selectedGuest;
    
    // Ocultar selector y mostrar invitación
    document.getElementById('guest-selector').style.display = 'none';
    
    // Actualizar el nombre del invitado en el encabezado
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) {
        guestNameEl.textContent = selectedGuest.name;
    }
    
    // Mostrar el contenido
    showContent();
    
    // Hacer scroll suave hasta el inicio de la invitación
    const headerSection = document.querySelector('.header');
    if (headerSection) {
        headerSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funciones de UI
function showContent() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    if (loadingEl && contentEl) {
        loadingEl.style.display = 'none';
        contentEl.classList.remove('hidden');
        // Asegurar que el contenido sea visible
        contentEl.style.opacity = '1';
        contentEl.style.transform = 'translateY(0)';
    }
}

function displayGuestName() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('nombre')?.trim() || "Invitado";
        const guestNameEl = document.getElementById('guest-name');
        
        if (guestNameEl) {
            guestNameEl.textContent = decodeURIComponent(guestName);
        }
    } catch (error) {
        console.error('Error al mostrar el nombre del invitado:', error);
        showErrorMessage('Error al cargar el nombre del invitado');
    }
}

// Cuenta regresiva
function startCountdown() {
    const graduationDate = new Date(CONFIG.GRADUATION_DATE).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = graduationDate - now;

        if (distance < 0) {
            showEventStarted();
            return;
        }

        updateCountdownValues(distance);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdownValues(distance) {
    const timeUnits = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };

    Object.entries(timeUnits).forEach(([unit, value]) => {
        const element = document.getElementById(unit);
        if (element) {
            element.textContent = String(value).padStart(2, '0');
        }
    });
}

function showEventStarted() {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = '<h2>¡El evento ha comenzado!</h2>';
    }
}

// Gestión de asistencia
function confirmAttendance(isAttending) {
    if (state.hasConfirmed) {
        showMessage('Ya has confirmado tu asistencia anteriormente.', 'warning');
        return;
    }

    const guestName = document.getElementById('guest-name')?.textContent || 'Invitado';
    const attendanceStatus = isAttending ? "Asistirá" : "No asistirá";
    const message = isAttending 
        ? `¡Gracias por confirmar, ${guestName}! Nos vemos el 30 de noviembre.`
        : `Lamentamos que no puedas asistir, ${guestName}.`;

    showMessage(message, isAttending ? 'success' : 'info');
    sendDataToGoogleSheets(guestName, attendanceStatus, "");
    state.hasConfirmed = true;

    // Deshabilitar botones después de confirmar
    const buttons = document.querySelectorAll('#attendance button');
    buttons.forEach(button => button.disabled = true);
}

// Gestión de mensajes
function updateCharCount(event) {
    const textarea = event.target;
    const currentLength = textarea.value.length;
    const charCountEl = document.getElementById('char-count');
    
    if (charCountEl) {
        charCountEl.textContent = currentLength;
    }

    // Validar longitud máxima
    if (currentLength > CONFIG.MAX_MESSAGE_LENGTH) {
        textarea.value = textarea.value.substring(0, CONFIG.MAX_MESSAGE_LENGTH);
    }
}

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

    const guestName = document.getElementById('guest-name')?.textContent || 'Invitado';
    
    sendDataToGoogleSheets(guestName, "Mensaje Enviado", message)
        .then(() => {
            showMessageSent();
            messageTextarea.value = '';
            updateCharCount({ target: messageTextarea });
            state.messagesSent++;
        })
        .catch(error => {
            showMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
            console.error('Error al enviar mensaje:', error);
        });
}

// Utilidades de UI
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('confirmation-message');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `message message-${type}`;
        messageEl.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

function showMessageSent() {
    const messageSentEl = document.getElementById('message-sent');
    if (messageSentEl) {
        messageSentEl.classList.remove('hidden');
        setTimeout(() => {
            messageSentEl.classList.add('hidden');
        }, 3000);
    }
}

function showErrorMessage(error) {
    console.error(error);
    showMessage('Ha ocurrido un error. Por favor, intenta nuevamente.', 'error');
}

// Comunicación con el servidor
async function sendDataToGoogleSheets(action, message = "") {
    if (!state.currentGuest) return;

    try {
        const data = {
            id: state.currentGuest.id,
            nombre: state.currentGuest.name,
            telefono: state.currentGuest.phone,
            accion: action,
            mensaje: message,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok && response.type !== 'opaque') {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error("Error al enviar datos:", error);
        throw error;
    }
}
function confirmAttendance(isAttending) {
    if (state.hasConfirmed) {
        showMessage('Ya has confirmado tu asistencia anteriormente.', 'warning');
        return;
    }

    const action = isAttending ? "Asistirá" : "No asistirá";
    
    sendDataToGoogleSheets(action)
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
        .catch(error => {
            showMessage('Error al confirmar asistencia. Por favor, intenta nuevamente.', 'error');
            console.error('Error:', error);
        });
    }

    