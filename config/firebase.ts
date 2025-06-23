
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqCdcAM6whUjKDQpqwbCiJBwwdMwYJEII",
  authDomain: "monsleep-a26e8.firebaseapp.com",
  projectId: "monsleep-a26e8",
  storageBucket: "monsleep-a26e8.firebasestorage.app",
  messagingSenderId: "731996091132",
  appId: "1:731996091132:web:89cbdfd6706806e09e5d79",
  measurementId: "G-5RG1B2WZ91"
};

const app = initializeApp(firebaseConfig);

const myPersistence = {
  type: 'LOCAL' as const,
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
};

const auth = initializeAuth(app, {
  persistence: [myPersistence, inMemoryPersistence]
});

const db = getFirestore(app);

export { auth, db };
