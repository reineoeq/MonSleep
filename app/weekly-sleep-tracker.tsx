import { ThemedText } from '@/components/ThemedText';
import monList from '@/constants/monList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface SleepDay {
  day: string;
  metGoal: boolean;
}

type Mon = {
  id: string;
  name: string;
  description: string;
  image: any;
  unlocked: boolean;
};

const WeeklySleepTracker = () => {
  const [sleepData, setSleepData] = useState<SleepDay[]>([]);
  const [progress, setProgress] = useState(0);
  const [hasEvolved, setHasEvolved] = useState(false);
  const [unlockedMons, setUnlockedMons] = useState<Mon[]>([]);
  const [monPickerVisible, setMonPickerVisible] = useState(false);
  const [selectedMon, setSelectedMon] = useState<Mon | null>(null);

  useEffect(() => {
    const loadSleepData = async () => {
      const newSleepData = [];

      for (const day of daysOfWeek) {
        const result = await AsyncStorage.getItem(`sleepRecord-${day}`);
        const metGoal = result === 'success';
        newSleepData.push({ day, metGoal });
      }

      setSleepData(newSleepData);

      const successfulDays = newSleepData.filter((d) => d.metGoal).length;
      setProgress(successfulDays);
    };

    loadSleepData();
  }, []);

  const canEvolve = progress === 7;

  useEffect(() => {
    const loadUnlockedMons = async () => {
      try {
        const stored = await AsyncStorage.getItem('unlockedMons');
        const unlockedIds = stored ? JSON.parse(stored) : [];

        const unlockedMonsRaw = monList.filter(mon => unlockedIds.includes(mon.id));

        const unlockedBaseMons = unlockedMonsRaw.filter(
          mon => !mon.description.toLowerCase().includes('evolved form')
        );

        setUnlockedMons(unlockedBaseMons);

        const selected = await AsyncStorage.getItem('selectedMonToEvolve');
        const found = monList.find((m) => m.id === selected);
        if (found) {
          setSelectedMon(found);
        }
      } catch (error) {
      }
    };

    loadUnlockedMons();
  }, []);



  const evolvedMon = selectedMon
    ? monList.find((mon) =>
        mon.description.startsWith(`${selectedMon.name}’s evolved form`)
      )
    : null;

  const imageSource = selectedMon
    ? hasEvolved && evolvedMon
      ? evolvedMon.image
      : selectedMon.image
    : require('../assets/images/mons/axol.png');

  const handleEvolve = () => {
    if (canEvolve) {
      setHasEvolved(true);
    }
  };

  function getCurrentWeekKey() {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber}`;
  }

  useEffect(() => {
    const autoResetIfNewWeek = async () => {
      const lastWeek = await AsyncStorage.getItem('lastWeek');
      const currentWeek = getCurrentWeekKey();

      if (lastWeek !== currentWeek) {
        await AsyncStorage.setItem('lastWeek', currentWeek);
        for (let day of daysOfWeek) {
          await AsyncStorage.removeItem(`sleepRecord-${day}`);
        }
      }
    };

    autoResetIfNewWeek();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Weekly Sleep Tracker' }} />
      <ThemedText style={styles.header}>🛌 Weekly Sleep Tracker</ThemedText>

      <TouchableOpacity onPress={() => setMonPickerVisible(true)} style={{ marginBottom: 12 }}>
        <ThemedText>Select Mon to Evolve</ThemedText>
      </TouchableOpacity>

      <Modal visible={monPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.header}>Select a Mon to Evolve</ThemedText>
            <ScrollView style={{ maxHeight: 300 }}>
              {unlockedMons.map((mon) => (
                <Pressable
                  key={mon.id}
                  onPress={async () => {
                    setSelectedMon(mon);
                    setMonPickerVisible(false);
                    await AsyncStorage.setItem('selectedMonToEvolve', mon.id);
                  }}
                  style={styles.eggOption}
                >
                  <Image source={mon.image} style={styles.optionImage} />
                  <ThemedText>{mon.name}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setMonPickerVisible(false)}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.calendarGrid}>
        {sleepData.map((entry, index) => (
          <View key={index} style={styles.dayBox}>
            <ThemedText style={styles.dayText}>{entry.day}</ThemedText>
            <ThemedText style={entry.metGoal ? styles.success : styles.fail}>
              {entry.metGoal ? '✅' : '❌'}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText style={styles.evolvingText}>🐣 Your Mon is evolving...</ThemedText>

      <TouchableOpacity onPress={handleEvolve} disabled={!canEvolve}>
        <Image source={imageSource} style={[styles.monImage, hasEvolved && styles.evolvedGlow]} />
      </TouchableOpacity>

      {canEvolve && !hasEvolved && (
        <ThemedText style={styles.clickToEvolve}>✨ Click to evolve! ✨</ThemedText>
      )}

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { flex: progress / 7 }]} />
        <View style={[styles.progressBarEmpty, { flex: 1 - progress / 7 }]} />
      </View>

      <ThemedText style={styles.progressText}>Progress: {progress}/7 days</ThemedText>
      {!canEvolve && <ThemedText style={styles.resetText}>Missed a day? Progress resets! 😢</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFF7F0',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  dayBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
    elevation: 2,
    width: 80,
  },
  dayText: {
    fontSize: 18,
    marginBottom: 6,
  },
  success: {
    fontSize: 20,
    color: 'green',
  },
  fail: {
    fontSize: 20,
    color: 'red',
  },
  evolvingText: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: '600',
  },
  clickToEvolve: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  monImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  evolvedGlow: {
    shadowColor: '#00FFAA',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 10,
    width: '80%',
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    backgroundColor: '#4CAF50',
  },
  progressBarEmpty: {
    backgroundColor: '#ccc',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  eggOption: {
    alignItems: 'center',
    marginBottom: 16,
  },
  optionImage: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
});

export default WeeklySleepTracker;