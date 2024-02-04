importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: 'AIzaSyCUfFlUk0PT-Rswl2aoCiaNBZMYQIbllXo',
    vapidKey: 'BDpFnJzR0mL030pHC6WLWa0d73nya8mnNMaZ3F-emDnRKT_1ANYG9NXxjIgfbWQz2D0YnvsAGf8LXMQ---dQ1s0',
    authDomain: 'menukita-56209.firebaseapp.com',
    projectId: 'menukita-56209',
    storageBucket: 'menukita-56209.appspot.com',
    messagingSenderId: '216721167099',
    appId: '1:216721167099:web:535bab08af3d77701a965e',
    measurementId: 'G-PES92S64XK'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };

    return clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((windowClients) => {
            windowClients.forEach((_, i) => {
                windowClients[i].postMessage('new-order');
            });
        });
});
