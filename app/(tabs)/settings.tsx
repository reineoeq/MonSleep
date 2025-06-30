import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SleepData from '@/ios/SleepData';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppleHealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Apple Health Sleep Data
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <SleepData />
      </ThemedView>
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
    backgroundColor: '#E8F0FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BryndanWrite',
  },
  content: {
    flex: 1,
    backgroundColor: '#E8F0FF',
  },
});