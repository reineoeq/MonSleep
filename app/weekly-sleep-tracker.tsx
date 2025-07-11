import { ThemedText } from '@/components/ThemedText';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface SleepDay {
  day: string;
  hours: number;
  metGoal: boolean;
}

const WeeklySleepTracker = () => {
  const [progress, setProgress] = useState(7); // number of successful days
  const [hasEvolved, setHasEvolved] = useState(false);

  const weeklyData: SleepDay[] = [
    { day: 'Mon', hours: 7, metGoal: true },
    { day: 'Tue', hours: 6.5, metGoal: true },
    { day: 'Wed', hours: 7, metGoal: true },
    { day: 'Thu', hours: 7, metGoal: true },
    { day: 'Fri', hours: 8, metGoal: true },
    { day: 'Sat', hours: 7.5, metGoal: true },
    { day: 'Sun', hours: 6, metGoal: true },
  ];

  const canEvolve = progress === 7;
  const imageSource = hasEvolved
    ? require('../assets/images/mons/trifin.png')
    : require('../assets/images/mons/tripole.png');

  const handleEvolve = () => {
    if (canEvolve) {
      setHasEvolved(true);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Weekly Sleep Tracker' }} />
      <ThemedText style={styles.header}>🛏️ Weekly Sleep Tracker</ThemedText>

      <View style={styles.calendarContainer}>
        {weeklyData.slice(0, 4).map((entry: SleepDay, index: number) => (
          <View key={index} style={styles.dayBox}>
            <ThemedText style={styles.dayText}>{entry.day}</ThemedText>
            <ThemedText style={styles.hoursText}>{entry.hours}h</ThemedText>
            <ThemedText style={entry.metGoal ? styles.success : styles.fail}>
              {entry.metGoal ? '✅' : '❌'}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.calendarContainer}>
        {weeklyData.slice(4).map((entry: SleepDay, index: number) => (
          <View key={index + 4} style={styles.dayBox}>
            <ThemedText style={styles.dayText}>{entry.day}</ThemedText>
            <ThemedText style={styles.hoursText}>{entry.hours}h</ThemedText>
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
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  dayBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    width: 80,
  },
  dayText: {
    fontSize: 20,
  },
  hoursText: {
    fontSize: 18,
    marginVertical: 4,
  },
  success: {
    fontSize: 18,
    color: 'green',
  },
  fail: {
    fontSize: 18,
    color: 'red',
  },
  evolvingText: {
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 100,
    fontSize: 30,
    fontWeight: '600',
  },
   clickToEvolve: {
    marginTop: -10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  monImage: {
    width: 300,
    height: 300,
    marginVertical: -50,
    paddingBottom: 50,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default WeeklySleepTracker;
