import { useCoinContext } from '@/app/CoinContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  
  /* Default coins */
  const { coins, setCoins } = useCoinContext();
  
  /* Default daily goal */
  // Daily goal state
  // const [goalTime, setGoalTime] = useState('7:00');
  // const [isEditing, setIsEditing] = useState(false);
  // const [selectedHours, setSelectedHours] = useState('7');
  // const [selectedMinutes, setSelectedMinutes] = useState('00');
  // const [initialLoad, setInitialLoad] = useState(true);

  // // Available time options
  // const hours = Array.from({length: 20}, (_, i) => i + 4); // 4-23 hours
  // const minutes = ['00', '15', '30', '45'];

  // // Load user data on mount
  // useEffect(() => {
  //   const loadUserData = async () => {
  //     try {
  //       const userId = auth.currentUser?.uid;
  //       if (userId) {
  //         const user = await getUserData(userId);
  //         if (user) {
  //           // Convert seconds to HH:MM format
  //           const hours = Math.floor(user.dailyGoal / 3600);
  //           const minutes = Math.floor((user.dailyGoal % 3600) / 60);
  //           const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
            
  //           setGoalTime(formattedTime);
  //           setSelectedHours(hours.toString());
  //           setSelectedMinutes(minutes.toString().padStart(2, '0'));
  //           setCoins(user.coins);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error loading user data:', error);
  //       Alert.alert('Error', 'Failed to load your data');
  //     } finally {
  //       setInitialLoad(false);
  //     }
  //   };

  //   loadUserData();
  // }, []);

  // const isValidTime = (time: string) => {
  //   const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  //   if (!timeRegex.test(time)) return false;
  //   const [hours] = time.split(':').map(Number);
  //   return hours >= 4;
  // };

  // const handleSave = async () => {
  //   const newTime = `${selectedHours}:${selectedMinutes}`;
    
  //   if (isValidTime(newTime)) {
  //     try {
  //       const userId = auth.currentUser?.uid;
  //       if (userId) {
  //         // Convert to seconds
  //         const hours = parseInt(selectedHours);
  //         const mins = parseInt(selectedMinutes);
  //         const totalSeconds = (hours * 3600) + (mins * 60);
          
  //         await updateDailyGoal(userId, totalSeconds);
  //         setGoalTime(newTime);
  //         setIsEditing(false);
  //       }
  //     } catch (error) {
  //       console.error('Error saving daily goal:', error);
  //       Alert.alert('Error', 'Failed to save your goal');
  //     }
  //   } else {
  //     Alert.alert('Invalid Time', 'Please enter a valid time (HH:MM format, minimum 4 hours)');
  //   }
  // };

  // if (initialLoad) {
  //   return (
  //     <ThemedView style={styles.loadingContainer}>
  //       <ThemedText>Loading your data...</ThemedText>
  //     </ThemedView>
  //   );
  // }

  const [goalTime, setGoalTime] = useState('7:00');
  const [isEditing, setIsEditing] = useState(false);
  const [inputTime, setInputTime] = useState(goalTime);

  const isValidTime = (time: string) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) return false;

  const [hours, minutes] = time.split(':').map(Number);
  return hours >= 4; //Time must be at least 4 hours.
  };

  const hours = Array.from({length: 20}, (_, i) => i + 4); // 4-23 hours
  const minutes = ['00', '15', '30', '45'];
  
  const [selectedHours, setSelectedHours] = useState('7');
  const [selectedMinutes, setSelectedMinutes] = useState('00');

  const handleSave = () => {
    const newTime = `${selectedHours}:${selectedMinutes}`;
    setGoalTime(newTime);
    setIsEditing(false);
  };
  // const handleSave = async () => {
  //   const newTime = `${selectedHours}:${selectedMinutes}`;
    
  //   if (isValidTime(newTime)) {
  //     try {
  //       const userId = auth.currentUser?.uid;
  //       if (userId) {
  //         const hours = parseInt(selectedHours);
  //         const mins = parseInt(selectedMinutes);
  //         const totalSeconds = (hours * 3600) + (mins * 60);
          
  //         await updateDailyGoal(userId, totalSeconds);
  //         setGoalTime(newTime);
  //         setIsEditing(false);
  //       }
  //     } catch (error) {
  //       console.error('Error saving daily goal:', error);
  //       Alert.alert('Error', 'Failed to save your goal');
  //     }
  //   } else {
  //     Alert.alert('Invalid Time', 'Please enter a valid time (HH:MM format, minimum 4 hours)');
  //   }
  // };

  /* weekly sleep tracker */
  /* monthly sleep tracker */
  /* egg timer */
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* MonSleep header */}
      <Image
        source={require('@/assets/images/monsleep.png')}
        style={styles.monsleepIcon}
      />
      
      {/* My coins */}
      <View style={styles.coinsContainer}>
        <ThemedText type="subtitle" style={styles.coinsText}>
          💰 My coins: {coins}
        </ThemedText>
      </View>

      {/* Daily goal */}
      <ThemedView style={styles.card}>
        <View style={styles.goalHeader}>
          <ThemedText type="title">Daily goal</ThemedText>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ThemedView style={styles.goalBox}>
          {isEditing ? (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedHours}
                  onValueChange={(itemValue) => setSelectedHours(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {hours.map(hour => (
                    <Picker.Item 
                      key={`hour-${hour}`} 
                      label={hour.toString()} 
                      value={hour.toString()} 
                    />
                  ))}
                </Picker>
                
                <ThemedText type="title" style={styles.timeSeparator}>:</ThemedText>
                
                <Picker
                  selectedValue={selectedMinutes}
                  onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {minutes.map(minute => (
                    <Picker.Item 
                      key={`minute-${minute}`} 
                      label={minute} 
                      value={minute} 
                    />
                  ))}
                </Picker>
              </View>
              
              <TouchableOpacity
                onPress={handleSave}
                style={{ marginTop: 10 }}
              >
                <ThemedText type="defaultSemiBold" style={{ color: '#fff', fontSize: 25 }}>
                  Save
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText type="title" style={styles.goalTime}>{goalTime}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      {/* Sleep tracker */}
      <ThemedView style={styles.card}>
        <ThemedText type="title">Sleep tracker</ThemedText>
        <ThemedText type="default" style={{color: '#696969'}}>coming soon...</ThemedText>
        <ThemedView style={styles.trackerRow}>
          <Image
            source={require('@/assets/images/chart.png')}
            style={styles.chart}
          />
          <ThemedText type="subtitle" style={styles.week}>This week</ThemedText>
          <Image
            source={require('@/assets/images/calendar.png')}
            style={styles.calendar}
          />
          <ThemedText type="subtitle" style={styles.month}>This month</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* My Mons */}
      <ThemedView style={styles.card}>
        <ThemedView style={styles.monsHeader}>
          <ThemedText type="title">My Mons</ThemedText>
          <ThemedText type="title">→</ThemedText>
        </ThemedView>
        <ThemedView style={styles.trackerRow}>
          <Pressable onPress={() => router.push('/egg-timer')}>
          <Image
            source={require('@/assets/images/tripole-egg-stage-1.gif')} 
            style={styles.eggGif}
          />
          </Pressable>
          <ThemedText style={styles.monEggText} type="default">Hatching in Progress...</ThemedText>
          <Pressable onPress={() => router.push('/moncyclopedia')}>
          <Image
            source={require('@/assets/images/moncyclopedia.png')} 
            style={styles.monBook}
          />
          </Pressable>
          <ThemedText style={styles.monBookText} type="default">Moncyclopedia</ThemedText>
        </ThemedView>
        {/* <ThemedView style={styles.monsRow}>
          <ThemedText style={styles.monText} type="subtitle">Hatching in Progress...</ThemedText>
          <ThemedText style={styles.monText} type="subtitle">Moncyclopedia</ThemedText>
        </ThemedView> */}
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
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monsleepIcon: {
    height: 80,
    width: 300,
    bottom: -25,
    alignSelf: 'center',
    marginTop: 15,
  },
  coinsContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  coinsText: {
    fontSize: 16,
    lineHeight: 20,
  },
  card: {
    marginVertical: 10,
    padding: 19,
    borderRadius: 16,
    backgroundColor: '#fff7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalBox: {
    backgroundColor: '#A1B2D0',
    borderRadius: 12,
    paddingVertical: 30,  
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  goalTime: {
    fontSize: 50,
    lineHeight: 50, 
    bottom: -5,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'BryndanWrite',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  picker: {
    width: 100,
    height: 150,
    color: 'white',
  },
  pickerItem: {
    color: 'white',
    fontSize: 24,
  },
  timeSeparator: {
    color: 'white',
    fontSize: 40,
    marginHorizontal: 5,
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  chart: {
    width: 130,
    height: 150,
  },
  week: {
    left: -100,
    top: 120,
  },
  calendar: {
    width: 160,
    height: 150,
    left: -30,
  },
  month: {
    left: -160,
    top: 120,
  },
  monsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  eggGif: {
    height: 200,
    width: 100,
    top: -60,
    left: 20,
  },
  monBook: {
    height: 150,
    width: 100,
    top: -20,
    left: -35,
  },
  monEggText: {
    top: 110,
    left: -100,
  },
  monBookText: {
    top: 110,
    left: -135,
  }
});
