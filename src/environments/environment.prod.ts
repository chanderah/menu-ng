export const environment = {
  production: true,
  shop: {
    name: 'Restaurant Menu Kita',
    whatsapp: 6287798992777,
    phone: 6221870123,
    address: {
      line1: 'Jl. Teratai 3 Blok A6 No. 8',
      line2: 'Perumahan Taman Duta, Cisalak',
      line3: 'Depok, Jawa Barat 16416',
    },
  },
  appUrl: 'https://menu-ng.vercel.app',
  // appUrl: 'https://chandrasa.fun',
  // apiUrl: 'https://api.chandrasa.fun/api',
  apiUrl: 'https://menu-go-production.up.railway.app/api',
  publicPath: 'https://public.chandrasa.fun',
  imagePath: '/assets/images',
  secretKey: 'chandrachansa@18',
  secretIV: 'chandrachansa@19',
  cloudinary: {
    cloudName: 'disom1qwi',
    folder: 'uploads',
    apiKey: '387243642969926',
    apiSecret: 'ReQ4un81jPjyZn82O5Art9aa3OA',
    url: 'cloudinary://387243642969926:ReQ4un81jPjyZn82O5Art9aa3OA@disom1qwi',
  },
  midtrans: {
    merchantId: 'G841504940',
    clientKey: 'SB-Mid-client-GgpC4e1u-jwZ2Txg',
    serverKey: 'SB-Mid-server-P3Ycuyiw8g6CzU3KHB4zO_Im',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyCUfFlUk0PT-Rswl2aoCiaNBZMYQIbllXo',
    vapidKey: 'BDpFnJzR0mL030pHC6WLWa0d73nya8mnNMaZ3F-emDnRKT_1ANYG9NXxjIgfbWQz2D0YnvsAGf8LXMQ---dQ1s0',
    authDomain: 'menukita-56209.firebaseapp.com',
    projectId: 'menukita-56209',
    storageBucket: 'menukita-56209.appspot.com',
    messagingSenderId: '216721167099',
    appId: '1:216721167099:web:535bab08af3d77701a965e',
    measurementId: 'G-PES92S64XK',
  },
};
