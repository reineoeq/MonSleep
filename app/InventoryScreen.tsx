import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

export default function InventoryScreen() {
  const { inventory } = useLocalSearchParams();
  const rawInventory = Array.isArray(inventory) ? inventory[0] : inventory;
  const items = JSON.parse(rawInventory || '[]');

  const getRarity = (id: string) => {
    if (id.includes('tripole') || 
        id.includes('mikue')|| 
        id.includes('peinto')||
        id.includes('snailie')||
        id.includes('shroomie')||
        id.includes('cattus')||
        id.includes('pavo')||
        id.includes('froggie')||
        id.includes('clavicorn')) return 'common';
    if (id.includes('blople') || 
        id.includes('cloudie') ||
        id.includes('dimidium')||
        id.includes('eu')) return 'rare';
    if (id.includes('orangeer') ||
        id.includes('quadsun')||
        id.includes('axel')||
        id.includes('amoebus')) return 'legendary';
    if (id.includes('pinkhorn')||
        id.includes('starie')||
        id.includes('piscibes')) return 'mythical';
    return 'unknown';
  };

  // Group items by rarity
  const grouped: Record<string, any[]> = {
    common: [],
    rare: [],
    legendary: [],
    mythical: [],
  };

  items.forEach((item: any) => {
    const rarity = getRarity(item.id);
    if (grouped[rarity]) {
      grouped[rarity].push(item);
    }
  });

  const rarityLabels: Record<string, string> = {
    common: '🥚 Common Eggs',
    rare: '🌟 Rare Eggs',
    legendary: '🔥 Legendary Eggs',
    mythical: '🧚 Mythical Eggs',
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Inventory' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.title}>🎒 Your Egg Inventory</ThemedText>

        {items.length === 0 ? (
          <ThemedText style={styles.empty}>
            You haven’t bought any eggs yet.
          </ThemedText>
        ) : (
          Object.entries(grouped).map(([rarity, eggs]) =>
            eggs.length > 0 ? (
              <View key={rarity} style={styles.section}>
                <ThemedText style={styles.sectionTitle}>
                  {rarityLabels[rarity]}
                </ThemedText>
                {eggs.map((item) => (
                  <ThemedView key={item.id} style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                    <ThemedText style={styles.name}>{item.name}</ThemedText>
                    <ThemedText style={styles.price}>
                      {item.price} coins
                    </ThemedText>
                  </ThemedView>
                ))}
              </View>
            ) : null
          )
        )}
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 240,
    height: 90,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  section: {
  marginBottom: 24,
    },
    sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    },
});
