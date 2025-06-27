import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function EggTimerScreen() {
    const totalSeconds = 1 * 5 * 2; // for testing: 10 seconds
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (running && secondsLeft > 0) {
            const timer = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [running, secondsLeft]);

    const formatTime = (s: number) => {
        const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
        const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const secs = String(s % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    const progress = 1 - secondsLeft / totalSeconds;

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

    return (
        <>
        <Stack.Screen options={{ title: 'Sleep Timer' }} />
        
        <ThemedView style={styles.screenContainer}>
            <ThemedText type="title" style={styles.header}> Egg Hatching Timer </ThemedText>

            <TouchableOpacity onPress={() => {}} style={styles.eggContainer}>
                <Image source={chooseEggImage(progress)} style={styles.eggImage} />
            </TouchableOpacity>


            <ThemedText style={styles.timerText}>{formatTime(secondsLeft)}</ThemedText>

            <View style={styles.progressBar}>
                <View style={{ flex: progress, backgroundColor: '#4caf50', height: 10, borderRadius: 5 }} />
                <View style={{ flex: 1 - progress, backgroundColor: '#ccc', height: 10, borderRadius: 5 }} />
            </View>

            <TouchableOpacity
                onPress={() => setRunning(!running)}
                style={[styles.button, { backgroundColor: '#4caf50', padding: 12, borderRadius: 8 }]}>
                <ThemedText style={{ color: '#fff', textAlign: 'center' }}> {running ? 'Stop' : 'Start'}
                </ThemedText>
            </TouchableOpacity>

        </ThemedView>
        </>
    );
}

export const styles = StyleSheet.create({
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
    eggContainer: {
        marginVertical: 20,
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
    },
});