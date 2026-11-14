importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

// Al dejar esto sin el showNotification, evitamos que se dupliquen las notificaciones
messaging.onBackgroundMessage(function(payload) {
    console.log('[sw.js] Notificación en segundo plano manejada por FCM:', payload);
});