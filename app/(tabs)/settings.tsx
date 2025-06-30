import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import SleepData from '@/ios/SleepData';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }>
        
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Apple Health Sleep Data
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.content}>
          <SleepData />
        </ThemedView>

        <Collapsible title="About Sleep Tracking">
          <ThemedText>
            This screen displays your sleep data from Apple Health. 
            The app requires permission to access your sleep analysis data.
          </ThemedText>
          {Platform.OS === 'ios' && (
            <ThemedText style={styles.note}>
              Note: Only available on iOS devices with Apple Health
            </ThemedText>
          )}
        </Collapsible>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FF', 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BryndanWrite',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  note: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
});