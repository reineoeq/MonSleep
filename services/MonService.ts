import { addDoc, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CollectedMon, Mon, User } from '../types/models';

export const addCollectedMon = async (collectedMon: Omit<CollectedMon, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'collectedMons'), {
    ...collectedMon,
    collectedAt: new Date(), // Ensure we store as Firestore timestamp
  });
  return docRef.id;
};

export const getUserCollectedMons = async (userId: string): Promise<CollectedMon[]> => {
  const q = query(collection(db, 'collectedMons'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      monId: data.monId,
      collectedAt: data.collectedAt?.toDate() || new Date(),
      hatchDuration: data.hatchDuration || 0
    };
  });
};

export const getAllMons = async (): Promise<Mon[]> => {
  const querySnapshot = await getDocs(collection(db, 'mons'));
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      rarity: data.rarity,
      imageUrl: data.imageUrl,
      description: data.description,
      baseValue: data.baseValue
    };
  });
};

export const addCoins = async (userId: string, coinsToAdd: number): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  // Using Firestore's increment to avoid race conditions
  await updateDoc(userRef, {
    coins: increment(coinsToAdd)
  });
};

export const getUserData = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    email: data.email || '',
    name: data.name || '',
    dailyGoal: data.dailyGoal || 25200, // Default 7 hours in seconds
    coins: data.coins || 0,
    createdAt: data.createdAt?.toDate() || new Date()
  };
};