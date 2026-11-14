const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Función para obtener la fecha en formato YYYY-MM-DD en la zona horaria de Chile
function getFechaChile(dateObj) {
    return new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'America/Santiago',
        year: 'numeric', month: '2-digit', day: '2-digit' 
    }).format(dateObj);
}

async function sendReminders() {
    const today = new Date();
    
    // Fecha de HOY en Chile
    const todayStr = getFechaChile(today); 
    
    // Fecha de hace 3 días en Chile
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    const threeDaysStr = getFechaChile(threeDaysFromNow);

    console.log(`Buscando vencimientos para hoy (${todayStr}) y en 3 días (${threeDaysStr})...`);

    const snap = await db.collection('servicios').where('status', '!=', 'pagado').get();
    
    const serviciosAvisar = [];
    snap.forEach(doc => {
        const data = doc.data();
        if (data.dueDate === todayStr || data.dueDate === threeDaysStr) {
            serviciosAvisar.push(data);
        }
    });

    if (serviciosAvisar.length === 0) {
        console.log('No hay servicios que requieran recordatorio en este momento.');
        return;
    }

    for (const service of serviciosAvisar) {
        const tokenDoc = await db.collection('tokens_notificaciones').doc(service.userId).get();
        if (!tokenDoc.exists) continue;
        
        const token = tokenDoc.data().token;
        
        let houseName = "tu propiedad";
        try {
            const houseDoc = await db.collection('casas').doc(service.houseId).get();
            if (houseDoc.exists) houseName = houseDoc.data().name;
        } catch(e) {}

        let title, body;
        const montoStr = service.amount > 0 ? `$${service.amount.toLocaleString('es-CL')}` : 'Monto por definir';

        if (service.dueDate === threeDaysStr) {
            title = `⏰ Recordatorio: ${service.name}`;
            body = `Vence en 3 días (${service.dueDate}). Casa: ${houseName}. Monto: ${montoStr}.`;
        } else {
            title = `🚨 ¡URGENTE! ${service.name} vence HOY`;
            body = `Último día para pagar. Casa: ${houseName}. Monto: ${montoStr}.`;
        }

        const message = {
            notification: { title, body },
            token: token
        };

        try {
            await admin.messaging().send(message);
            console.log(`✅ Notificación enviada: ${title}`);
        } catch (error) {
            console.error(`❌ Error al enviar notificación a ${service.userId}:`, error);
        }
    }
}

sendReminders().catch(console.error);