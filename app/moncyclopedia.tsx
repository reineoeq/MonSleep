import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from '@/config/firebase';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { getAllMons, getUserCollectedMons } from '../services/MonService';

export default function MoncyclopediaScreen() {
  const [collectedMons, setCollectedMons] = useState<any[]>([]);
  const [allMons, setAllMons] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadMons = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      
      try {
        const userMons = await getUserCollectedMons(userId);
        const allMons = await getAllMons();
        
        setCollectedMons(userMons);
        setAllMons(allMons);
      } catch (error) {
        console.error('Error loading Mons:', error);
      }
    };

    loadMons();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Moncyclopedia' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>My Mons Collection</ThemedText>
        
        <FlatList
          data={allMons}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.monCard}>
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.monImage} 
                defaultSource={require('../assets/images/moncyclopedia.png')}
              />
              <ThemedText type="subtitle" style={styles.monName}>
                {item.name}
              </ThemedText>
              <ThemedText type="default" style={styles.monStatus}>
                {collectedMons.some(m => m.monId === item.id) ? '✔ Collected' : 'Not Collected'}
              </ThemedText>
            </View>
          )}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  monCard: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  monImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  monName: {
    fontSize: 16,
    marginBottom: 4,
  },
  monStatus: {
    fontSize: 14,
    color: '#666',
  },
});