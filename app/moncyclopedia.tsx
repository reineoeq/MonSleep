import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const monList = [
  {
    id: 'tripole',
    name: 'Tripole',
    description: 'A shy tadpole Mon with three big eyes.',
    image: require('../assets/images/tripole.png'),
    unlocked: true,
  },
  {
    id: 'trifin',
    name: 'Trifin',
    description: 'Tripole’s evolved form, confident and fast.',
    image: require('../assets/images/trifin.png'),
    unlocked: false,
  },
  {
    id: 'orangeer',
    name: 'Orangeer',
    description: 'A friendly deer-like creature.',
    image: require('../assets/images/orangeer.png'),
    unlocked: true,
  },
  {
    id: 'orangorn',
    name: 'Orangorn',
    description: 'Orangeer’s evolved form, tall and strong.',
    image: require('../assets/images/orangorn.png'),
    unlocked: false,
  },
  {
    id: 'pinkhorn',
    name: 'Pinkhorn',
    description: 'A tiny pink blob.',
    image: require('../assets/images/pinkhorn.png'),
    unlocked: false,
  },
  {
    id: 'pinkile',
    name: 'Pinkile',
    description: 'Pinkhorn’s evolved form, a bigger pink blob with arms and legs.',
    image: require('../assets/images/pinkile.png'),
    unlocked: false,
  },
];

export default function MoncyclopediaScreen() {
  const totalMons = monList.length;
  const unlockedMons = monList.filter((mon) => mon.unlocked).length;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Moncyclopedia' }} />
      <ThemedText style={styles.header}>
        Your Mons ({unlockedMons}/{totalMons})
      </ThemedText>

      <FlatList
        data={monList}
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
      <ThemedText style={styles.header}>
        More Coming Soon... 
      </ThemedText>
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
