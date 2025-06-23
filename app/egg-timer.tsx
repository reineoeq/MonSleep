import { useCoinContext } from '@/app/CoinContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';

type CollectedMon = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  dateCollected: Date;
}

export default function EggTimerScreen() {
  const router = useRouter();
  const { coins, setCoins } = useCoinContext();
  const [collectedMons, setCollectedMons] = useState<CollectedMon[]>([]); 
  const [running, setRunning] = useState(false);
  const [eggHatched, setEggHatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyGoalSeconds, setDailyGoalSeconds] = useState(0); 
  const [secondsLeft, setSecondsLeft] = useState(10);//testing w 10
  

  // useEffect(() => {
  //   const fetchDailyGoal = async () => {
  //     try {
  //       const userId = auth.currentUser?.uid;
  //       if (!userId) {
  //         router.push('/login');
  //         return;
  //       }

  //       const user = await getUserData(userId);
  //       if (user) {
  //         setDailyGoalSeconds(user.dailyGoal);
  //         setSecondsLeft(user.dailyGoal);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching daily goal:', error);
  //       Alert.alert('Error', 'Failed to load your sleep goal');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDailyGoal();
  // }, []);
  
    useEffect(() => {
    if (running && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (secondsLeft <= 0 && !eggHatched && dailyGoalSeconds > 0) {
      handleEggHatch();
    }
  }, [running, secondsLeft, eggHatched, dailyGoalSeconds]);

  const handleEggHatch = async () => {
    setRunning(false);
    setEggHatched(true);
    
    // const userId = auth.currentUser?.uid;
    // if (!userId) return;

    const coinsEarned = 10;
    
    // try {
    //   await addCoins(userId, coinsEarned);
      
    //   await addCollectedMon({
    //     userId,
    //     monId: 'tripole-mon-id',
    //     collectedAt: new Date(),
    //     hatchDuration: dailyGoalSeconds - secondsLeft,
    //   });

      // update local 
      setCoins(coins + coinsEarned);
      
      Alert.alert(
        'Egg Hatched!',
        `Congratulations! You earned ${coinsEarned} coins!`,
        [
          { text: 'OK', onPress: () => router.push('/moncyclopedia') },
          { text: 'Stay Here', style: 'cancel' }
        ]
      );
    // } catch (error) {
    //   console.error('Error updating backend:', error);
    //   Alert.alert('Error', 'Failed to save your progress');
    // }
  };

  const formatTime = (s: number) => {
    const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const progress = 1 - secondsLeft / dailyGoalSeconds;

  function chooseEggImage(progress: number): ImageSourcePropType {
    if (progress < 0.33) {
      return require('../assets/images/eggs/tripole-egg-stage-1.gif');
    } else if (progress < 0.66) {
      return require('../assets/images/eggs/tripole-egg-stage-2.gif');
    } else if (progress < 0.999) {
      return require('../assets/images/eggs/tripole-egg-stage-3.gif');
    } else {
      return require('../assets/images/tripole.png');
    }
  }

  const resetTimer = () => {
    setSecondsLeft(dailyGoalSeconds);
    setRunning(false);
    setEggHatched(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Sleep Timer' }} />
      <ThemedView style={styles.screenContainer}>
        <ThemedText type="title" style={styles.header}>Egg Hatching Timer</ThemedText>
        
        <ThemedText type="subtitle" style={styles.coinText}>
          💰 Coins: {coins}
        </ThemedText>

        <TouchableOpacity onPress={() => {}} style={styles.eggContainer}>
          <Image 
            source={chooseEggImage(progress)} 
            style={styles.eggImage} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ThemedText style={styles.timerText}>{formatTime(secondsLeft)}</ThemedText>

        <View style={styles.progressBar}>
          <View style={{ 
            flex: progress, 
            backgroundColor: '#4caf50', 
            height: 10, 
            borderRadius: 5 
          }} />
          <View style={{ 
            flex: 1 - progress, 
            backgroundColor: '#ccc', 
            height: 10, 
            borderRadius: 5 
          }} />
        </View>

        {!eggHatched ? (
          <TouchableOpacity
            onPress={() => setRunning(!running)}
            style={[styles.button, { 
              backgroundColor: running ? '#f44336' : '#4caf50',
              padding: 12,
              borderRadius: 8
            }]}
          >
            <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
              {running ? 'Stop' : 'Start'}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={resetTimer}
            style={[styles.button, { 
              backgroundColor: '#2196F3',
              padding: 12,
              borderRadius: 8
            }]}
          >
            <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
              Hatch Another Egg
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fdf6ee', 
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  coinText: {
    fontSize: 18,
    marginBottom: 10,
  },
  eggContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
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
    marginTop: 16,
    width: '60%',
  },
});