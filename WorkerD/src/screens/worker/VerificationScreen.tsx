import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedButton } from '../../components/common/ThemedButton';
import { BilingualText } from '../../components/common/BilingualText';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import * as workerService from '../../api/workerService';

export const VerificationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { updateProfile } = useAuth();
  const navigation = useNavigation();

  const handleUpload = async () => {
    try {
      if (profile?.id) {
        const currentProfile = await workerService.getWorkerProfile(profile.id);
        await workerService.createOrUpdateProfile({
          ...currentProfile,
          verificationStatus: 'pending'
        });
        await updateProfile({ verificationStatus: 'pending' }); // Update local context too
      }
      
      Alert.alert(
        'Success / सफल',
        'Verification documents uploaded! We will review them shortly.\nसत्यापन दस्तावेज़ अपलोड हो गए! हम जल्द ही उनकी समीक्षा करेंगे।'
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading verification:', error);
      Alert.alert('Error', 'Failed to submit verification.');
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
        <ThemedText style={{ fontSize: 22 }}>←</ThemedText>
      </TouchableOpacity>

      {/* Title */}
      <BilingualText
        primary={t('profile_verification')}
        secondary="प्रोफ़ाइल सत्यापन"
        type="headline"
        size="medium"
        weight="800"
        icon="🛡️"
        style={styles.title}
      />

      {/* Subtitle */}
      <ThemedText type="body" color={theme.Colors.grey[500]} style={styles.subtitle}>
        {t('verified_workers_info')}
      </ThemedText>
      <ThemedText type="body" size="small" color={theme.Colors.grey[400]} style={{ marginBottom: 32 }}>
        सत्यापित कामगारों को 3 गुना अधिक काम और तेज भुगतान मिलता है।
      </ThemedText>

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        <View style={[styles.stepItem, { borderColor: theme.Colors.primary }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.primary }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>1</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.primary}>
            Aadhaar / आधार
          </ThemedText>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.Colors.grey[200] }]} />
        <View style={[styles.stepItem, { borderColor: theme.Colors.grey[300] }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.grey[300] }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>2</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
            Selfie / सेल्फी
          </ThemedText>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.Colors.grey[200] }]} />
        <View style={[styles.stepItem, { borderColor: theme.Colors.grey[300] }]}>
          <View style={[styles.stepCircle, { backgroundColor: theme.Colors.grey[300] }]}>
            <ThemedText weight="800" style={{ color: '#fff', fontSize: 14 }}>3</ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
            Submit / जमा
          </ThemedText>
        </View>
      </View>

      {/* Upload Boxes */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: theme.Colors.primary, backgroundColor: theme.Colors.primary + '08' }]}
          accessibilityLabel="Upload Aadhaar front photo"
        >
          <ThemedText style={{ fontSize: 40 }}>🪪</ThemedText>
          <BilingualText
            primary={t('upload_aadhaar_front')}
            secondary="आधार का अगला भाग अपलोड करें"
            type="title"
            size="small"
            weight="700"
            align="center"
          />
          <ThemedText type="label" size="small" color={theme.Colors.primary} style={{ marginTop: 4 }}>
            Tap here / यहाँ टैप करें ☝️
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: theme.Colors.secondary, backgroundColor: theme.Colors.secondary + '08' }]}
          accessibilityLabel="Take a selfie photo"
        >
          <ThemedText style={{ fontSize: 40 }}>📸</ThemedText>
          <BilingualText
            primary={t('take_selfie')}
            secondary="सेल्फी लें"
            type="title"
            size="small"
            weight="700"
            align="center"
          />
          <ThemedText type="label" size="small" color={theme.Colors.secondary} style={{ marginTop: 4 }}>
            Tap here / यहाँ टैप करें ☝️
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedButton
        title={`${t('submit_review')} / समीक्षा के लिए जमा करें`}
        onPress={handleUpload}
        style={styles.submitBtn}
        icon={<ThemedText style={{ fontSize: 18 }}>✅</ThemedText>}
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
