import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import monList from '@/constants/monList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

export default function MoncyclopediaScreen() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  const loadUnlocked = useCallback(async () => {
    const stored = await AsyncStorage.getItem('unlockedMons');
    const parsed = stored ? JSON.parse(stored) : [];
    setUnlockedIds(parsed);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnlocked();
    }, [loadUnlocked])
  );

  const updatedMonList = monList.map((mon) => ({
    ...mon,
    unlocked: unlockedIds.includes(mon.id),
  }));

  const totalMons = monList.length;
  const unlockedMons = updatedMonList.filter((mon) => mon.unlocked).length;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Moncyclopedia' }} />
      <ThemedText style={styles.header}>
        Your Mons ({unlockedMons}/{totalMons})
      </ThemedText>

      <FlatList
        data={updatedMonList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.unlocked && styles.lockedCard]}>
            <Image
              source={item.image}
              style={[styles.image, !item.unlocked && { opacity: 0.3 }]}
              resizeMode="contain"
            />
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.description}>
              {item.unlocked ? item.description : '??? (Locked)'}
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf6ee',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 40,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  lockedCard: {
    backgroundColor: '#eee',
  },
  image: {
    width: Dimensions.get('window').width / 2,
    height: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    color: '#444',
  },
});
