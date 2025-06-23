import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type ShopItem = {
  id: string;
  name: string;
  price: number;
  image: any; 
  available: boolean;
};

export default function MonShop() {
  const router = useRouter();
  const [coins, setCoins] = useState(0); 
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);

  useEffect(() => {
    const loadShopItems = () => {
      const today = new Date().getDate(); //refresh eggs daily 
      const mockItems: ShopItem[] = [
        {
          id: `egg-1-${today}`,
          name: 'Common Egg',
          price: 20,
          image: require('@/assets/images/tripole-egg-stage-1.gif'), //egg 1
          available: true
        },
        {
          id: `egg-2-${today}`,
          name: 'Rare Egg',
          price: 50,
          image: require('@/assets/images/tripole-egg-stage-1.gif'), // egg2
          available: true
        },
        {
          id: `egg-3-${today}`,
          name: 'Legendary Egg',
          price: 100,
          image: require('@/assets/images/tripole-egg-stage-1.gif'), // egg 3
          available: true
        },
        {
          id: `egg-4-${today}`,
          name: 'Mythical Egg',
          price: 200,
          image: require('@/assets/images/tripole-egg-stage-1.gif'), // egg 4
          available: true
        }
      ];
      setShopItems(mockItems);
    };

    loadShopItems();
  }, []);

  //handle purchase
  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      alert(`You purchased a ${item.name}!`);
    } else {
      alert("Not enough coins!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* shop header with mascot */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/MontyShop.png')} //change to mascot
          style={styles.mascot}
        />
        <ThemedText type="title" style={styles.shopTitle}>Monty's Shop</ThemedText>
      </View>

      {/* coin balance */}
      <ThemedView style={styles.coinCard}>
        <ThemedText type="subtitle" style={styles.coinText}>
          💰 My coins: {coins}
        </ThemedText>
      </ThemedView>

      {/* welcome message */}
      <ThemedView style={styles.welcomeCard}>
        <ThemedText type="title" style={styles.welcomeText}>
          Welcome to
        </ThemedText>
        <ThemedText type="title" style={styles.welcomeText}>
          Monty's Shop!
        </ThemedText>
      </ThemedView>

      {/* shop items */}
      <ThemedView style={styles.itemsContainer}>
        {shopItems.map((item) => (
          <ThemedView key={item.id} style={styles.itemCard}>
            <Image
              source={item.image}
              style={styles.itemImage}
            />
            <ThemedText type="subtitle" style={styles.itemName}>
              {item.name}
            </ThemedText>
            <ThemedText type="default" style={styles.itemPrice}>
              {item.price} coins
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.buyButton,
                { backgroundColor: coins >= item.price ? '#4CAF50' : '#9E9E9E' }
              ]}
              onPress={() => handlePurchase(item)}
              disabled={coins < item.price}
            >
              <ThemedText type="defaultSemiBold" style={styles.buyButtonText}>
                Buy
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#E8F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    marginBottom: -30,
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: -40,
  },
  shopTitle: {
    fontSize: 40,
    lineHeight: 120, 
    marginTop: -10,
    marginBottom: -50,
    color: '#3A405A',
  },
  coinCard: {
    backgroundColor: '#FFF7EB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  coinText: {
    fontSize: 18,
  },
  welcomeCard: {
    backgroundColor: '#A1B2D0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: {
    width: 280,
    height: 100,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#3A405A',
    marginBottom: 10,
  },
  buyButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: '100%',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
  },
});