import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';

export const SignupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="headline" size="large">Signup</ThemedText>
      <ThemedText type="body" style={styles.subtitle}>Join the WorkerD community</ThemedText>
      
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.button}>Create Account (Demo)</ThemedText>
      </ThemedCard>
      
      <ThemedText 
        type="label" 
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    marginBottom: 40,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    fontWeight: 'bold',
    padding: 10,
  },
  link: {
    marginTop: 20,
    textDecorationLine: 'underline',
  }
});

export default SignupScreen;
