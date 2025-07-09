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

const EGG_POOL: Record<string, ShopItem[]> = {
  common: [
    {
      id: 'tripole-egg',
      name: 'Tripole Egg',
      price: 20,
      image: require('@/assets/images/eggs/tripole-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'mikue-egg',
      name: 'Mikue Egg',
      price: 20,
      image: require('@/assets/images/eggs/mikue-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'peinto-egg',
      name: 'Peinto Egg',
      price: 20,
      image: require('@/assets/images/eggs/peinto-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'snailie-egg',
      name: 'Snailie Egg',
      price: 20,
      image: require('@/assets/images/eggs/snailie-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'shroomie-egg',
      name: 'Shroomie Egg',
      price: 20,
      image: require('@/assets/images/eggs/shroomie-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'cattus-egg',
      name: 'Cattus Egg',
      price: 20,
      image: require('@/assets/images/eggs/cattus-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'pavo-egg',
      name: 'Pavo Egg',
      price: 20,
      image: require('@/assets/images/eggs/pavo-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'froggie-egg',
      name: 'Froggie Egg',
      price: 20,
      image: require('@/assets/images/eggs/froggie-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'clavicorn-egg',
      name: 'Clavicorn Egg',
      price: 20,
      image: require('@/assets/images/eggs/clavicorn-egg-stage-1.gif'),
      available: true,
    },
  ],
  rare: [
    {
      id: 'blople-egg',
      name: 'Blople Egg',
      price: 50,
      image: require('@/assets/images/eggs/blople-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'cloudie-egg',
      name: 'Cloudie Egg',
      price: 50,
      image: require('@/assets/images/eggs/cloudie-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'dimidium-egg',
      name: 'Dimidium Egg',
      price: 50,
      image: require('@/assets/images/eggs/dimidium-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'eu-egg',
      name: 'Eu Egg',
      price: 50,
      image: require('@/assets/images/eggs/eu-egg-stage-1.gif'),
      available: true,
    },
  ],
  legendary: [
    {
      id: 'orangeer-egg',
      name: 'Orangeer Egg',
      price: 100,
      image: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'quadsun-egg',
      name: 'Quadsun Egg',
      price: 100,
      image: require('@/assets/images/eggs/quadsun-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'axel-egg',
      name: 'Axel Egg',
      price: 100,
      image: require('@/assets/images/eggs/axel-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'amoebus-egg',
      name: 'Amoebus Egg',
      price: 100,
      image: require('@/assets/images/eggs/amoebus-egg-stage-1.gif'),
      available: true,
    },
  ],
  mythical: [
    {
      id: 'pinkhorn-egg',
      name: 'Pinkhorn Egg',
      price: 200,
      image: require('@/assets/images/eggs/pinkhorn-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'starie-egg',
      name: 'Starie Egg',
      price: 200,
      image: require('@/assets/images/eggs/starie-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'piscibes-egg',
      name: 'Piscibes Egg',
      price: 200,
      image: require('@/assets/images/eggs/piscibes-egg-stage-1.gif'),
      available: true,
    },
  ]
};

export default function MonShop() {
  const router = useRouter();
  const [coins, setCoins] = useState(10000); 
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<ShopItem[]>([]);

  useEffect(() => {
    const loadShopItems = () => {
    const dynamicShop: ShopItem[] = [
    {
      id: 'buy-common',
      name: 'Common Egg',
      price: 20,
      image: require('@/assets/images/eggs/tripole-egg-stage-1.gif'), 
      available: true,
    },
    {
      id: 'buy-rare',
      name: 'Rare Egg',
      price: 50,
      image: require('@/assets/images/eggs/blople-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'buy-legendary',
      name: 'Legendary Egg',
      price: 100,
      image: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
      available: true,
    },
    {
      id: 'buy-mythical',
      name: 'Mythical Egg',
      price: 200,
      image: require('@/assets/images/eggs/pinkhorn-egg-stage-1.gif'),
      available: true,
    }
  ];

  setShopItems(dynamicShop);
};

    loadShopItems();
  }, []);

  //handle purchase
  const handlePurchase = (shopItem: ShopItem) => {
  const rarity = shopItem.name.toLowerCase().replace(' egg', '');
  const pool = EGG_POOL[rarity];
  const ownedIds = inventory.map((item) => item.id);
  const unownedEggs = pool.filter((egg) => !ownedIds.includes(egg.id));

  if (unownedEggs.length === 0) {
    alert(`You already own all ${rarity} eggs!`);
    return;
  }
  const randomEgg = unownedEggs[Math.floor(Math.random() * unownedEggs.length)];

  if (coins >= shopItem.price) {
    setCoins(coins - shopItem.price);
    setInventory(prev => [...prev, randomEgg]);
    alert(`🎉 You got a ${randomEgg.name}!`);
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

      {/* inventory */}
      <TouchableOpacity
        style={{
          backgroundColor: '#FFB347',
          borderRadius: 10,
          paddingVertical: 10,
          marginBottom: 10,
          alignItems: 'center',
        }}
        onPress={() => router.push({
          pathname: '/InventoryScreen', 
          params: { inventory: JSON.stringify(inventory) } 
        })}
      >
        <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
          🧺 View My Inventory
        </ThemedText>
      </TouchableOpacity>

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
      {shopItems.map((item) => {
        const rarity = item.name.toLowerCase().replace(' egg', '');
        const ownedIds = inventory.map((egg) => egg.id);
        const allOwned =
          EGG_POOL[rarity]?.every((egg) => ownedIds.includes(egg.id)) ?? true;

        const canAfford = coins >= item.price;
        const soldOut = allOwned;

        return (
          <ThemedView key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} />
            <ThemedText type="subtitle" style={styles.itemName}>
              {item.name}
            </ThemedText>
            <ThemedText type="default" style={styles.itemPrice}>
              {item.price} coins
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.buyButton,
                {
                  backgroundColor: soldOut
                    ? '#B0B0B0'
                    : canAfford
                    ? '#4CAF50'
                    : '#9E9E9E',
                },
              ]}
              onPress={() => handlePurchase(item)}
              disabled={!canAfford || soldOut}
            >
              <ThemedText type="defaultSemiBold" style={styles.buyButtonText}>
                {soldOut ? 'Sold Out' : 'Buy'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      })}
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
    paddingVertical: 40,
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
    marginTop: 10,
    marginBottom: 10,
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
    marginBottom: 10,
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