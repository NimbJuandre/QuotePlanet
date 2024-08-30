import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAvVnxakdapZgS0uedLyrVmXQPaOGtf-NE",
    authDomain: "quoteplanet-87ea1.firebaseapp.com",
    projectId: "quoteplanet-87ea1",
    storageBucket: "quoteplanet-87ea1.appspot.com",
    messagingSenderId: "855522486095",
    appId: "1:855522486095:web:15f2707ce644c460bf073a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };