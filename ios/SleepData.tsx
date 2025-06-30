import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, View } from 'react-native';
//import { Health } from '@/utils/mockHealth';

const SleepData = () => {
  const [sleepData, setSleepData] = useState([]);
  const [totalSleepHours, setTotalSleepHours] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestSleepPermission = async () => {
    try {
      setLoading(true);
      
      const isAvailable = await Health.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Health not available', 'Apple Health is not available on this device');
        return;
      }

      const granted = await Health.requestPermissionsAsync([
        Health.HealthDataTypes.SLEEP_ANALYSIS
      ]);
      
      if (granted) {
        setIsAuthorized(true);
        fetchSleepData();
      } else {
        Alert.alert('Permission denied', 'Sleep data access was denied');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request sleep permission: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSleepData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const sleepAnalysis = await Health.getHealthDataAsync(
        Health.HealthDataTypes.SLEEP_ANALYSIS,
        {
          startDate: weekAgo,
          endDate: now,
        }
      );

      const processedSleep = processSleepData(sleepAnalysis);
      setSleepData(processedSleep);
      
      const lastNightSleep = calculateLastNightSleep(sleepAnalysis);
      setTotalSleepHours(lastNightSleep);

    } catch (error) {
      Alert.alert('Error', 'Failed to fetch sleep data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const processSleepData = (rawSleepData) => {
    if (!rawSleepData || rawSleepData.length === 0) return [];

    const sleepByDate = {};
    
    rawSleepData.forEach(entry => {
      const date = new Date(entry.startDate).toDateString();
      
      if (!sleepByDate[date]) {
        sleepByDate[date] = {
          date: date,
          asleepTime: 0,
          sleepSessions: []
        };
      }
      
      const startTime = new Date(entry.startDate);
      const endTime = new Date(entry.endDate);
      const duration = (endTime - startTime) / (1000 * 60);
      
      if (entry.value === 'asleep') {
        sleepByDate[date].asleepTime += duration;
      }
      
      sleepByDate[date].sleepSessions.push({
        type: entry.value,
        start: startTime.toLocaleTimeString(),
        end: endTime.toLocaleTimeString(),
        duration: Math.round(duration)
      });
    });

    return Object.values(sleepByDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
  };

  const calculateLastNightSleep = (sleepData) => {
    if (!sleepData || sleepData.length === 0) return 0;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const lastNightSleep = sleepData.filter(entry => {
      const entryDate = new Date(entry.startDate).toDateString();
      return entryDate === yesterdayStr && entry.value === 'asleep';
    });
    
    const totalMinutes = lastNightSleep.reduce((total, entry) => {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      return total + ((end - start) / (1000 * 60));
    }, 0);
    
    return (totalMinutes / 60).toFixed(1);
  };

  return (
    <ScrollView style={styles.container}>
      {!isAuthorized ? (
        <ThemedView style={styles.authContainer}>
          <ThemedText type="subtitle" style={styles.description}>
            Connect to Apple Health to view your sleep data
          </ThemedText>
          <Button
            title={loading ? "Connecting..." : "Connect Sleep Data"}
            onPress={requestSleepPermission}
            disabled={loading}
          />
        </ThemedView>
      ) : (
        <View style={styles.dataContainer}>
          <Button
            title={loading ? "Refreshing..." : "Refresh Sleep Data"}
            onPress={fetchSleepData}
            disabled={loading}
          />
          
          <ThemedView style={styles.summaryCard}>
            <ThemedText type="subtitle" style={styles.summaryTitle}>Last Night</ThemedText>
            <ThemedText type="title" style={styles.summaryValue}>{totalSleepHours} hours</ThemedText>
            <ThemedText type="default" style={styles.summaryLabel}>Total Sleep</ThemedText>
          </ThemedView>
          
          <ThemedText type="title" style={styles.sectionTitle}>Sleep History (Last 7 Days)</ThemedText>
          
          {sleepData.length === 0 ? (
            <ThemedText style={styles.noData}>No sleep data found</ThemedText>
          ) : (
            sleepData.map((day, index) => (
              <ThemedView key={index} style={styles.sleepCard}>
                <ThemedText type="subtitle" style={styles.dateText}>{day.date}</ThemedText>
                
                <View style={styles.sleepStats}>
                  <View style={styles.statItem}>
                    <ThemedText type="title" style={styles.statValue}>
                      {(day.asleepTime / 60).toFixed(1)}h
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>Asleep</ThemedText>
                  </View>
                </View>
                
                {day.sleepSessions.length > 0 && (
                  <ThemedView style={styles.sessionsContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.sessionsTitle}>Sleep Sessions:</ThemedText>
                    {day.sleepSessions.map((session, idx) => (
                      <ThemedText key={idx} style={styles.sessionText}>
                        {session.type}: {session.start} - {session.end} ({session.duration}min)
                      </ThemedText>
                    ))}
                  </ThemedView>
                )}
              </ThemedView>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F0FF',
  },
  authContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff7eb',
    borderRadius: 16,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#A1B2D0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
    fontFamily: 'BryndanWrite',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'BryndanWrite',
  },
  sleepCard: {
    backgroundColor: '#fff7eb',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'BryndanWrite',
  },
  sleepStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A1B2D0',
    fontFamily: 'BryndanWrite',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sessionsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E8F0FF',
    borderRadius: 12,
  },
  sessionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sessionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SleepData;

// okay this kind of does not really work but it's a work in progress