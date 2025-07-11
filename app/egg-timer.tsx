import { useCoinContext } from '@/app/CoinContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Simulate inventory eggs
// const inventoryEggs = [
//   {
//     id: 'tripole',
//     name: 'Tripole Egg',
//     stage1: require('@/assets/images/eggs/tripole-egg-stage-1.gif'),
//     stage2: require('@/assets/images/eggs/tripole-egg-stage-2.gif'),
//     stage3: require('@/assets/images/eggs/tripole-egg-stage-3.gif'),
//     hatched: require('@/assets/images/tripole.png'),
//   },
//   {
//     id: 'orangeer',
//     name: 'Orangeer Egg',
//     stage1: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
//     stage2: require('@/assets/images/eggs/orangeer-egg-stage-2.gif'),
//     stage3: require('@/assets/images/eggs/orangeer-egg-stage-3.gif'),
//     hatched: require('@/assets/images/orangeer.png'),
//   },
// ];

export default function EggTimerScreen() {
  const router = useRouter();
  const { coins, addCoins } = useCoinContext();

  const [running, setRunning] = useState(false);
  const [eggHatched, setEggHatched] = useState(false);
  const [dailyGoalSeconds, setDailyGoalSeconds] = useState(25200); // Default 7 hours
  const [secondsLeft, setSecondsLeft] = useState(25200);
  const [inventoryEggs, setInventoryEggs] = useState<any[]>([]);
  const [selectedEgg, setSelectedEgg] = useState<any | null>(null);
  const [eggPickerVisible, setEggPickerVisible] = useState(false);
  const [unlockedMons, setUnlockedMons] = useState<string[]>([]);

  useEffect(() => {
    const loadGoal = async () => {
      const storedSeconds = await AsyncStorage.getItem('dailyGoalSeconds');
      const goal = storedSeconds ? parseInt(storedSeconds) : 25200;
      setDailyGoalSeconds(goal);

      const storedEnd = await AsyncStorage.getItem('eggTimerEnd');
      if (storedEnd) {
        const timeLeft = Math.max(Math.floor((parseInt(storedEnd) - Date.now()) / 1000), 0);
        setSecondsLeft(timeLeft);

        if (timeLeft > 0) {
          setRunning(true);
        } else {
          setRunning(false);
          setSecondsLeft(0);
          handleEggHatch();
        }
      } else {
        setSecondsLeft(goal);
      }
    };

    loadGoal();
  }, []);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRunning(false);
            handleEggHatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [running, secondsLeft]);

  useEffect(() => {
    const loadInventory = async () => {
      const stored = await AsyncStorage.getItem('inventory');
      const parsed = stored ? JSON.parse(stored) : [];
      setInventoryEggs(parsed);
      if (parsed.length > 0) {
        setSelectedEgg(parsed[0]);
      } else {
        setSelectedEgg(null); 
      }
    };
    loadInventory();
  }, []);

  const handleEggHatch = async () => {
    setRunning(false);
    setEggHatched(true);
    await AsyncStorage.removeItem('eggTimerEnd');

    const coinsEarned = 10;
    addCoins(coinsEarned);

    if (selectedEgg) {
      setUnlockedMons([...unlockedMons, selectedEgg.id]);

      const updatedInventory = inventoryEggs.filter((egg) => egg.id !== selectedEgg.id);
      setInventoryEggs(updatedInventory);
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));

      setSelectedEgg(updatedInventory.length > 0 ? updatedInventory[0] : null);

      Alert.alert(
        'Egg Hatched!',
        `You earned ${coinsEarned} coins and unlocked ${selectedEgg.id.replace('-egg', '')}!`,
        [
          { text: 'See Moncyclopedia', onPress: () => router.push('/moncyclopedia') },
          { text: 'Stay Here', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Goal Completed!',
        `You earned ${coinsEarned} coins! Keep saving for more eggs!`
      );
    }
  };

  const formatTime = (s: number) => {
    const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const progress = 1 - secondsLeft / dailyGoalSeconds;

  const getEggImage = () => {
    if (!selectedEgg) return null;
    if (eggHatched) return selectedEgg.hatched;
    if (progress < 0.33) return selectedEgg.stage1;
    if (progress < 0.66) return selectedEgg.stage2;
    return selectedEgg.stage3;
  };

  const resetTimer = async () => {
    setSecondsLeft(dailyGoalSeconds);
    setRunning(false);
    setEggHatched(false);
    await AsyncStorage.removeItem('eggTimerEnd');
  };

  const toggleTimer = async () => {
    if (!running) {
      const endTimestamp = Date.now() + secondsLeft * 1000;
      await AsyncStorage.setItem('eggTimerEnd', endTimestamp.toString());
      setRunning(true);
    } else {
      setRunning(false);
      await AsyncStorage.removeItem('eggTimerEnd');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Egg Hatching' }} />
      <ThemedView style={styles.screenContainer}>
        <ThemedText type="title" style={styles.header}>Egg Timer</ThemedText>
        <ThemedText type="subtitle">💰 Coins: {coins}</ThemedText>

        {/* Egg Selection */}
        <TouchableOpacity
          onPress={() => selectedEgg ? setEggPickerVisible(true) : null}
          style={[
            styles.selectEggButton,
            { opacity: selectedEgg ? 1 : 0.6 },
          ]}
        >
          <ThemedText style={styles.selectEggText}>
            {selectedEgg ? `🎯 Selected Egg: ${selectedEgg.name}` : `🥚 No Egg Selected`}
          </ThemedText>
        </TouchableOpacity>

        {selectedEgg && (
          <Image source={getEggImage()} style={styles.eggImage} resizeMode="contain" />
        )}

        <ThemedText style={styles.timerText}>{formatTime(secondsLeft)}</ThemedText>

        <View style={styles.progressBar}>
          <View style={{ flex: progress, backgroundColor: '#4caf50', height: 10, borderRadius: 5 }} />
          <View style={{ flex: 1 - progress, backgroundColor: '#ccc', height: 10, borderRadius: 5 }} />
        </View>

        {!eggHatched ? (
          <TouchableOpacity
            onPress={() => setRunning(!running)}
            style={[styles.button, { backgroundColor: running ? '#f44336' : '#4caf50' }]}
          >
            <ThemedText style={styles.buttonText}>{running ? 'Stop' : 'Start'}</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={resetTimer} style={[styles.button, { backgroundColor: '#2196F3' }]}>
            <ThemedText style={styles.buttonText}>Start Another Session</ThemedText>
          </TouchableOpacity>
        )}

        {/* Egg Picker Modal */}
        <Modal visible={eggPickerVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="title">Choose an Egg</ThemedText>
              <ScrollView style={{ marginTop: 12 }}>
                {inventoryEggs.map((egg) => (
                  <Pressable
                    key={egg.id}
                    onPress={() => {
                      setSelectedEgg(egg);
                      setEggPickerVisible(false);
                      resetTimer();
                    }}
                    style={styles.eggOption}
                  >
                    <Image source={egg.stage1} style={styles.optionImage} />
                    <ThemedText>{egg.name}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setEggPickerVisible(false)} style={{ marginTop: 12 }}>
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fdf6ee',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectEggButton: {
    marginVertical: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffeeba',
  },
  selectEggText: {
    fontSize: 16,
  },
  eggImage: {
    width: 500,
    height: 300,
  },
  timerText: {
    fontSize: 50,
    fontWeight: 'bold',
    lineHeight: 50,
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 10,
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff7eb',
    padding: 20,
    borderRadius: 12,
  },
  eggOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
});
