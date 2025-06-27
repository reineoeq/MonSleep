import { ThemedText } from '@/components/ThemedText';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Define the type for each day's data
interface SleepDay {
  date: number;
  hours: number;
  metGoal: boolean;
}

const daysInMonth = 30; // Example month size
const dailyGoal = 7; // 7 hours sleep goal

const sleepData: SleepDay[] = Array.from({ length: daysInMonth }, (_, i) => {
  const randomHours = Math.round(Math.random() * 10);
  return {
    date: i + 1,
    hours: randomHours,
    metGoal: randomHours >= dailyGoal,
  };
});

const numCols = 7;
const numRows = Math.ceil(daysInMonth / numCols);

const MonthlySleepTracker = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Monthly Sleep Tracker' }} />
      <ThemedText style={styles.header}>📅 Monthly Sleep Tracker</ThemedText>

      <View style={styles.calendarWrapper}>
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {sleepData.slice(rowIndex * numCols, (rowIndex + 1) * numCols).map((entry, i) => (
              <View style={styles.dayCell} key={i}>
                <ThemedText style={styles.date}>{entry.date}</ThemedText>
                <ThemedText style={styles.hours}>{entry.hours}h</ThemedText>
                <ThemedText style={entry.metGoal ? styles.success : styles.fail}>
                  {entry.metGoal ? '✅' : '❌'}
                </ThemedText>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FDF6EE',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  calendarWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
  },
  dayCell: {
    width: 48,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hours: {
    fontSize: 15,
    marginVertical: 0,
  },
  success: {
    color: 'green',
    fontSize: 15,
  },
  fail: {
    color: 'red',
    fontSize: 15,
  },
});

export default MonthlySleepTracker;
