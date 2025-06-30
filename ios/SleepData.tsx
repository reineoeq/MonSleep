import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, View } from 'react-native';
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.SleepAnalysis],
    write: [],
  },
} as HealthKitPermissions;

const SleepData = () => {
  interface SleepSession {
    start: string;
    end: string;
    duration: number;
  }
  
  interface ProcessedSleepData {
    date: string;
    asleepTime: number;  
    sleepSessions: {
      start: string;
      end: string;
      duration: number;
    }[];
  }
  
  const [sleepData, setSleepData] = useState<ProcessedSleepData[]>([]);
  const [totalSleepHours, setTotalSleepHours] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestSleepPermission = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Platform not supported', 'Apple Health is only available on iOS devices');
      return;
    }

    try {
      setLoading(true);
      
      // Check if HealthKit is available (iOS only)
      AppleHealthKit.isAvailable((err, available) => {
        if (err) {
          Alert.alert('Error', 'Error checking Health availability: ' + err);
          setLoading(false);
          return;
        }

        if (!available) {
          Alert.alert('Health not available', 'Apple Health is not available on this device');
          setLoading(false);
          return;
        }
        
        // Request permissions
        AppleHealthKit.initHealthKit(permissions, (error) => {
          if (error) {
            Alert.alert('Permission denied', 'Sleep data access was denied: ' + error);
            console.log('Error initializing HealthKit: ', error);
          } else {
            console.log('HealthKit initialized successfully');
            setIsAuthorized(true);
            fetchSleepData();
          }
          setLoading(false);
        });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Failed to request sleep permission: ' + message);
      setLoading(false);
    }
  };

  const fetchSleepData = () => {
    try {
      setLoading(true);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get sleep data
      const options = {
        startDate: weekAgo.toISOString(),
        endDate: now.toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (err: string, results: HealthValue[]) => {
        setLoading(false);
        
        if (err) {
          Alert.alert('Error', 'Failed to fetch sleep data: ' + err);
          console.log('Sleep data error:', err);
          return;
        }
        
        console.log('Sleep data received:', results?.length || 0, 'samples');
        
        if (!results || results.length === 0) {
          setSleepData([]);
          setTotalSleepHours(0);
          return;
        }

        // Process and set sleep data
        const processedSleep = processSleepData(results);
        setSleepData(processedSleep);
        
        const lastNightSleep = calculateLastNightSleep(results);
        setTotalSleepHours(lastNightSleep);
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Failed to fetch sleep data: ' + errorMessage);
      setLoading(false);
    }
  };

  const processSleepData = (rawSleepData: HealthValue[]): ProcessedSleepData[] => {
    if (!rawSleepData || rawSleepData.length === 0) return [];
  
    const sleepByDate: Record<string, ProcessedSleepData> = {};
      
    rawSleepData.forEach(entry => {
      const date = new Date(entry.startDate).toDateString();
      
      if (!sleepByDate[date]) {
        sleepByDate[date] = {
          date: date,          // Required date property
          asleepTime: 0,       // Only tracking asleep time
          sleepSessions: []    // Sessions array
        };
      }
      
      const startTime = new Date(entry.startDate);
      const endTime = new Date(entry.endDate);
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      sleepByDate[date].asleepTime += duration;
      
      sleepByDate[date].sleepSessions.push({
        start: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: Math.round(duration)
      });
    });
  
    return Object.values(sleepByDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };
  
  const calculateLastNightSleep = (sleepData: HealthValue[]) => {
    if (!sleepData || sleepData.length === 0) return 0;
    
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Look for sleep data from last night 
    const lastNightSleep = sleepData.filter(entry => {
      const entryStart = new Date(entry.startDate);
      const entryEnd = new Date(entry.endDate);
      
      // Check if sleep session overlaps with last night
      const isRecentSleep = (entryStart >= new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)) &&
                           (entryEnd <= now);
      
      return isRecentSleep && entry.metadata?.value === 'Asleep';
    });
    
    // Get the most recent sleep session
    if (lastNightSleep.length === 0) return 0;
    
    const mostRecentSleep = lastNightSleep.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];
    
    const start = new Date(mostRecentSleep.startDate);
    const end = new Date(mostRecentSleep.endDate);
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    return parseFloat((totalMinutes / 60).toFixed(1));
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
            <ThemedView style={styles.noDataContainer}>
              <ThemedText style={styles.noData}>No sleep data found</ThemedText>
              <ThemedText style={styles.noDataHint}>
                Make sure you have sleep data in Apple Health and try refreshing
              </ThemedText>
            </ThemedView>
          ) : (
            sleepData.map((day, index) => (
              <ThemedView key={index} style={styles.sleepCard}>
                <ThemedText type="subtitle" style={styles.dateText}>{day.date}</ThemedText>
                
                <View style={styles.sleepStats}>
                  <View style={styles.statItem}>
                    <ThemedText type="title" style={styles.statValue}>
                      {(day.asleepTime / 60).toFixed(1)}h
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>Total Sleep</ThemedText>
                  </View>
                </View>

                {day.sleepSessions.length > 0 && (
                  <ThemedView style={styles.sessionsContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.sessionsTitle}>Sleep Sessions:</ThemedText>
                    {day.sleepSessions.map((session, idx) => (
                      <ThemedText key={idx} style={styles.sessionText}>
                        {session.start} - {session.end} ({session.duration}min)
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
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 10,
  },
  noDataHint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default SleepData;
// okay this kind of does not really work but it's a work in progress