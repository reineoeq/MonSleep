import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const daysInMonth = dayjs().daysInMonth();
const numCols = 7;
const numRows = Math.ceil(daysInMonth / numCols);

interface SleepDay {
  date: number;
  status: 'success' | 'fail' | 'none';
}

const MonthlySleepTracker = () => {
  const [sleepData, setSleepData] = useState<SleepDay[]>([]);

  useEffect(() => {
    const loadSleepData = async () => {
      const today = dayjs();
      const currentMonth = today.format('YYYY-MM');
      const data: SleepDay[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentMonth}-${String(day).padStart(2, '0')}`; 
        const record = await AsyncStorage.getItem(`sleepRecord-${dateKey}`);

        data.push({
          date: day,
          status: record === 'success' ? 'success' : record === 'fail' ? 'fail' : 'none',
        });
      }

      setSleepData(data);
    };

    loadSleepData();
  }, []);

  useEffect(() => {
    const autoResetIfNewMonth = async () => {
      const lastMonth = await AsyncStorage.getItem('lastMonth');
      const currentMonth = dayjs().format('YYYY-MM');

      if (lastMonth !== currentMonth) {
        await AsyncStorage.setItem('lastMonth', currentMonth);
        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = `${currentMonth}-${String(day).padStart(2, '0')}`;
          await AsyncStorage.removeItem(`sleepRecord-${dateKey}`);
        }
      }
    };

    autoResetIfNewMonth();
  }, []);


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Monthly Sleep Tracker' }} />
      <ThemedText style={styles.header}>📅 Monthly Sleep Tracker</ThemedText>

      <View style={styles.calendarWrapper}>
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {sleepData
              .slice(rowIndex * numCols, (rowIndex + 1) * numCols)
              .map((entry, i) => (
                <View style={styles.dayCell} key={i}>
                  <ThemedText style={styles.date}>{entry.date}</ThemedText>
                  <ThemedText
                    style={
                      entry.status === 'success'
                        ? styles.success
                        : entry.status === 'fail'
                        ? styles.fail
                        : styles.none
                    }
                  >
                    {entry.status === 'success'
                      ? '✅'
                      : entry.status === 'fail'
                      ? '❌'
                      : '⬜️'}
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
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
    fontSize: 18,
  },
  fail: {
    color: 'red',
    fontSize: 18,
  },
  none: {
    color: '#aaa',
    fontSize: 18,
  },
});

export default MonthlySleepTracker;
