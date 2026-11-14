importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// ⚠️ PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE (Los mismos datos que en index.html)
const firebaseConfig = {
    apiKey: "AIzaSyCVg6257crDKMc-Rnt3BNm2DF7RXnCdgjc",
    authDomain: "gestor-de-servicios-17324.firebaseapp.com",
    projectId: "gestor-de-servicios-17324",
    storageBucket: "gestor-de-servicios-17324.firebasestorage.app",
    messagingSenderId: "933565685122",
    appId: "1:933565685122:web:6ca27f0886f1780f55839b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Notificación en segundo plano:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135679.png' // Icono genérico
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});