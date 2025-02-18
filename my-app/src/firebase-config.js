import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBA6kSdMBKr2Q4ZCOlr3VJ8k_B4PpFdsUU",
  authDomain: "todoistclone-a33b1.firebaseapp.com",
  projectId: "todoistclone-a33b1",
  storageBucket: "todoistclone-a33b1.firebasestorage.app",
  messagingSenderId: "63030415174",
  appId: "1:63030415174:web:69937da39537dd5df4df47",
  measurementId: "G-RVZ9DPLD5F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };