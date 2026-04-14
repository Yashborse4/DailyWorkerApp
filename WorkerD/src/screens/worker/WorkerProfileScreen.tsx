import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export const WorkerProfileScreen = () => {
  const { theme } = useTheme();
  const { profile, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const getStatusColor = () => {
    switch (profile?.verificationStatus) {
      case 'verified': return theme.Colors.success;
      case 'pending': return theme.Colors.warning;
      default: return theme.Colors.error;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.Colors.primary + '20' }]}>
            <ThemedText style={{ fontSize: 32 }}>👤</ThemedText>
          </View>
          <ThemedText type="headline" size="medium">{profile?.name || 'Worker Name'}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor() }]}>
             <ThemedText type="label" size="small" color={getStatusColor()}>
               {profile?.verificationStatus?.toUpperCase() || 'UNVERIFIED'}
             </ThemedText>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <ThemedText type="label" size="medium" color={theme.Colors.grey[500]}>Location</ThemedText>
            <ThemedText type="title" size="small">📍 {profile?.location || 'Not set'}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText type="label" size="medium" color={theme.Colors.grey[500]}>Trade</ThemedText>
            <ThemedText type="title" size="small">🛠️ {profile?.categories?.join(', ') || 'Not set'}</ThemedText>
          </View>
        </View>

        {profile?.verificationStatus !== 'verified' && (
          <TouchableOpacity 
            style={[styles.verifyBtn, { backgroundColor: theme.Colors.primary }]}
            onPress={() => navigation.navigate('Verification')}
          >
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>VERIFY PROFILE FOR MORE JOBS</ThemedText>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
           <ThemedText type="label" color={theme.Colors.error}>Log Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginTop: 8 },
  infoSection: { gap: 20, marginBottom: 40 },
  infoRow: { gap: 4 },
  verifyBtn: { paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  logoutBtn: { marginTop: 40, padding: 20, alignItems: 'center' }
});

export default WorkerProfileScreen;
