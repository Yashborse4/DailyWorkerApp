import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export const RoleSelectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="headline" size="large" style={styles.title}>Welcome!</ThemedText>
      <ThemedText type="title" size="medium" style={styles.subtitle}>How would you like to use WorkerD?</ThemedText>
      
      <View style={styles.selectionContainer}>
        <ThemedCard 
          style={[styles.roleCard, { borderColor: theme.Colors.worker.base }]}
          onPress={() => navigation.navigate('WorkerApp')}
        >
          <ThemedText type="title" size="large" color={theme.Colors.worker.base}>I am a Worker</ThemedText>
          <ThemedText type="body" size="small" style={styles.description}>
            Find jobs, build your profile, and earn money.
          </ThemedText>
        </ThemedCard>

        <ThemedCard 
          style={[styles.roleCard, { borderColor: theme.Colors.hirer.base }]}
          onPress={() => navigation.navigate('HirerApp')}
        >
          <ThemedText type="title" size="large" color={theme.Colors.hirer.base}>I am a Hirer</ThemedText>
          <ThemedText type="body" size="small" style={styles.description}>
            Post jobs, manage applicants, and hire talent.
          </ThemedText>
        </ThemedCard>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 48,
    textAlign: 'center',
  },
  selectionContainer: {
    gap: 20,
  },
  roleCard: {
    borderWidth: 2,
    alignItems: 'center',
    paddingVertical: 32,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  }
});

export default RoleSelectionScreen;
