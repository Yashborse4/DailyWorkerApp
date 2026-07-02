import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedButton } from '../../components/common/ThemedButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import * as workerService from '../../api/workerService';

export const VerificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { profile, updateProfile } = useAuth();
  const navigation = useNavigation();

  const handleUpload = async () => {
    try {
      if (profile?.id) {
        const currentProfile = await workerService.getWorkerProfile(profile.id);
        await workerService.createOrUpdateProfile({
          ...currentProfile,
          verificationStatus: 'pending'
        });
        await updateProfile({ verificationStatus: 'pending' });
      }
      
      Alert.alert(
        t('common:success'),
        t('common:verification_uploaded_msg')
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading verification:', error);
      Alert.alert(t('common:error'), t('common:failed_submit_verification'));
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
        accessibilityLabel="Go back"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back-outline" size={24} color={theme.Colors.onBackground} />
      </TouchableOpacity>

      {/* Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <Ionicons name="shield-checkmark-outline" size={24} color={theme.Colors.primary} style={{ marginRight: 8 }} />
        <ThemedText type="headline" size="medium" weight="800">
          {t('common:profile_verification')}
        </ThemedText>
      </View>

      {/* Subtitle */}
      <ThemedText type="body" color={theme.Colors.grey[500]} style={[styles.subtitle, { marginBottom: 32 }]}>
        {t('common:verified_workers_info')}
      </ThemedText>

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        <View style={[styles.stepItem, { borderColor: theme.Colors.primary }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.primary }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>1</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.primary}>
            {t('common:aadhaar')}
          </ThemedText>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.Colors.grey[200] }]} />
        <View style={[styles.stepItem, { borderColor: theme.Colors.grey[300] }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.grey[300] }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>2</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
            {t('common:selfie')}
          </ThemedText>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.Colors.grey[200] }]} />
        <View style={[styles.stepItem, { borderColor: theme.Colors.grey[300] }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.grey[300] }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>3</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
            {t('common:submit')}
          </ThemedText>
        </View>
      </View>

      {/* Upload Boxes */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: theme.Colors.primary, backgroundColor: theme.Colors.primary + '08' }]}
          accessibilityLabel="Upload Aadhaar front photo"
        >
          <Ionicons name="card-outline" size={40} color={theme.Colors.primary} />
          <ThemedText type="title" size="small" weight="700" style={{ textAlign: 'center' }}>
            {t('common:upload_aadhaar_front')}
          </ThemedText>
          <ThemedText type="label" size="small" color={theme.Colors.primary} style={{ marginTop: 4 }}>
            {t('common:tap_here')} ☝️
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: theme.Colors.secondary, backgroundColor: theme.Colors.secondary + '08' }]}
          accessibilityLabel="Take a selfie photo"
        >
          <Ionicons name="camera-outline" size={40} color={theme.Colors.secondary} />
          <ThemedText type="title" size="small" weight="700" style={{ textAlign: 'center' }}>
            {t('common:selfie')}
          </ThemedText>
          <ThemedText type="label" size="small" color={theme.Colors.secondary} style={{ marginTop: 4 }}>
            {t('common:tap_here')} ☝️
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedButton
        title={t('common:submit_review')}
        onPress={handleUpload}
        style={styles.submitBtn}
        icon={<Ionicons name="checkmark-outline" size={18} color="#fff" />}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: -8,
  },
  title: { marginTop: 8, marginBottom: 8 },
  subtitle: { marginBottom: 4 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    height: 2,
    width: 40,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  uploadContainer: { gap: 16, marginBottom: 32 },
  uploadBox: {
    height: 160,
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtn: { marginTop: 'auto', marginBottom: 20 },
});

export default VerificationScreen;
