import { useCoinContext } from '@/app/CoinContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Simulate inventory eggs
const inventoryEggs = [
  {
    id: 'tripole',
    name: 'Tripole Egg',
    stage1: require('@/assets/images/eggs/tripole-egg-stage-1.gif'),
    stage2: require('@/assets/images/eggs/tripole-egg-stage-2.gif'),
    stage3: require('@/assets/images/eggs/tripole-egg-stage-3.gif'),
    hatched: require('@/assets/images/tripole.png'),
  },
  {
    id: 'orangeer',
    name: 'Orangeer Egg',
    stage1: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
    stage2: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
    stage3: require('@/assets/images/eggs/orangeer-egg-stage-1.gif'),
    hatched: require('@/assets/images/orangeer.png'),
  },
];

export default function EggTimerScreen() {
  const router = useRouter();
  const { coins, addCoins } = useCoinContext();

  const [running, setRunning] = useState(false);
  const [eggHatched, setEggHatched] = useState(false);
  const [dailyGoalSeconds, setDailyGoalSeconds] = useState(25200); // Default 7 hours
  const [secondsLeft, setSecondsLeft] = useState(25200);
  const [selectedEgg, setSelectedEgg] = useState(inventoryEggs[0]);
  const [eggPickerVisible, setEggPickerVisible] = useState(false);
  const [unlockedMons, setUnlockedMons] = useState<string[]>([]);

  useEffect(() => {
    const loadGoal = async () => {
      const storedSeconds = await AsyncStorage.getItem('dailyGoalSeconds');
      if (storedSeconds) {
        const seconds = parseInt(storedSeconds);
        setDailyGoalSeconds(seconds);
        setSecondsLeft(seconds);
      } else {
        setDailyGoalSeconds(25200); // Default 7 hours
        setSecondsLeft(25200);
      }
    };
    loadGoal();
  }, []);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (secondsLeft <= 0 && !eggHatched && dailyGoalSeconds > 0) {
      handleEggHatch();
    }
  }, [running, secondsLeft, eggHatched]);

  const handleEggHatch = () => {
    setRunning(false);
    setEggHatched(true);
    const coinsEarned = 10;
    console.log('Egg hatched. Calling addCoins.');
    addCoins(coinsEarned);
    setUnlockedMons([...unlockedMons, selectedEgg.id]);

    Alert.alert(
      'Egg Hatched!',
      `You earned ${coinsEarned} coins and unlocked ${selectedEgg.id}!`,
      [
        { text: 'See Moncyclopedia', onPress: () => router.push('/moncyclopedia') },
        { text: 'Stay Here', style: 'cancel' },
      ]
    );
  };

  const formatTime = (s: number) => {
    const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const progress = 1 - secondsLeft / dailyGoalSeconds;

  const getEggImage = () => {
    if (eggHatched) return selectedEgg.hatched;
    if (progress < 0.33) return selectedEgg.stage1;
    if (progress < 0.66) return selectedEgg.stage2;
    return selectedEgg.stage3;
  };

  const resetTimer = () => {
    setSecondsLeft(dailyGoalSeconds);
    setRunning(false);
    setEggHatched(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Egg Hatching' }} />
      <ThemedView style={styles.screenContainer}>
        <ThemedText type="title" style={styles.header}>Egg Timer</ThemedText>
        <ThemedText type="subtitle">💰 Coins: {coins}</ThemedText>

        {/* Egg Selection */}
        <TouchableOpacity onPress={() => setEggPickerVisible(true)} style={styles.selectEggButton}>
          <ThemedText style={styles.selectEggText}>🎯 Selected Egg: {selectedEgg.name}</ThemedText>
        </TouchableOpacity>

        <Image
          source={getEggImage()}
          style={styles.eggImage}
          resizeMode="contain"
        />

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
            <ThemedText style={styles.buttonText}>Hatch Another Egg</ThemedText>
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
