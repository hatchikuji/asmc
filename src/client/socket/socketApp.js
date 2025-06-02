import { ref } from 'vue';
import { io } from 'socket.io-client';

const socket = ref(null);
const isConnected = ref(false);

export async function initSocket(token) {
    if (socket.value && socket.value.connected) {
        console.log("Socket déjà connectée", socket.value.id);
        return socket.value;
    }

    socket.value = io("http://localhost:3000", {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });

    socket.value.on("connect", () => {
        isConnected.value = true;
        console.log("Socket connectée", socket.value.id);
    });

    socket.value.on("disconnect", () => {
        isConnected.value = false;
        console.log("Socket déconnectée", socket.value.id);
    });

    socket.value.on('reconnect_attempt', () => {
        console.log("Tentative de reconnexion...", socket.value.id);
    });

    socket.value.on('reconnect_error', (error) => {
        console.error("Erreur de reconnexion:", error, socket.value.id);
    });

    socket.value.on('reconnect_failed', () => {
        console.error("Échec de la reconnexion après plusieurs tentatives", socket.value.id);
    });

    socket.value.on('reconnect', (attempt) => {
        console.log(`Reconnecté après ${attempt} tentatives`, socket.value.id);
    });


    socket.value.on('sendMessage', (messageData) => {
        socket.value.emit('newMessage', messageData);
    })

    return socket.value;
}

export function getSocket() {
    return socket.value;
}
