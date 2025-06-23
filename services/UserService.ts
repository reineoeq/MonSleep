import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/models';

export const createUser = async (userId: string, userData: Partial<User>) => {
    await setDoc(doc(db, 'users', userId), {
        ...userData,
        dailyGoal: 25200, 
        coins: 0,
        createdAt: new Date(),
    });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as User : null;
};

export const updateDailyGoal = async (userId: string, goalSeconds: number) => {
    await updateDoc(doc(db, 'users', userId), {
        dailyGoal: goalSeconds,
    });
};

export const addCoins = async (userId: string, coinsToAdd: number) => {
  const user = await getUser(userId);
  if (user) {
    await updateDoc(doc(db, 'users', userId), {
      coins: user.coins + coinsToAdd,
    });
  }
};