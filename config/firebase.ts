import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqCdcAM6whUjKDQpqwbCiJBwwdMwYJEII",
  authDomain: "monsleep-a26e8.firebaseapp.com",
  projectId: "monsleep-a26e8",
  storageBucket: "monsleep-a26e8.appspot.com",
  messagingSenderId: "731996091132",
  appId: "1:731996091132:web:89cbdfd6706806e09e5d79",
  measurementId: "G-5RG1B2WZ91"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
