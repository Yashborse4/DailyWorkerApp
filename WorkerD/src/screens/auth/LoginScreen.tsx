import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="headline" size="large">Login</ThemedText>
      <ThemedText type="body" style={styles.subtitle}>Welcome back to WorkerD</ThemedText>
      
      <ThemedCard style={styles.card}>
        <ThemedText 
          style={styles.button} 
          onPress={() => navigation.navigate('RoleSelection')}
        >
          Login (Demo - Role Selection)
        </ThemedText>
      </ThemedCard>
      
      <ThemedText 
        type="label" 
        style={styles.link}
        onPress={() => navigation.navigate('Signup')}
      >
        Don't have an account? Sign up
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
    marginBottom: 20,
  },
  button: {
    fontWeight: 'bold',
    padding: 10,
  },
  link: {
    marginTop: 10,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
