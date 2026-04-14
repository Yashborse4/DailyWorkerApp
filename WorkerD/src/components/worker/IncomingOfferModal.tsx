import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Animated, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import { ThemedView } from '../common/ThemedView';
import { ThemedText } from '../common/ThemedText';
import { useTheme } from '../../hooks/useTheme';
import { useJobOffer } from '../../context/JobOfferContext';
import SoundService from '../../services/SoundService';

const { width, height } = Dimensions.get('window');

export const IncomingOfferModal = () => {
  const { theme } = useTheme();
  const { activeOffer, isRinging, acceptOffer, rejectOffer } = useJobOffer();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRinging) {
      // Start Ringing Animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ])
      ).start();

      // Trigger Vibration
      const interval = setInterval(() => {
        Vibration.vibrate([0, 500, 200, 500]);
      }, 2000);

      // Trigger Native Ringtone
      SoundService.playRingtone();

      return () => {
        clearInterval(interval);
        Vibration.cancel();
        SoundService.stopRingtone();
      };
    }
  }, [isRinging]);

  if (!isRinging || !activeOffer) return null;

  return (
    <Modal visible={isRinging} transparent animationType="fade">
      <ThemedView style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.95)' }]}>
        <View style={styles.content}>
          <ThemedText color={theme.Colors.white} weight="600" style={styles.incomingLabel}>INCOMING JOB OFFER</ThemedText>
          
          <View style={styles.avatarContainer}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], borderColor: theme.Colors.primary }]} />
            <Animated.View style={[styles.avatarBox, { transform: [{ translateX: shakeAnim }], backgroundColor: theme.Colors.primary + '30' }]}>
               <ThemedText style={{ fontSize: 48 }}>👷</ThemedText>
            </Animated.View>
          </View>

          <ThemedText type="headline" size="medium" weight="800" color={theme.Colors.white} style={styles.hirerName}>
            {activeOffer.postedBy || 'Prime Construction'}
          </ThemedText>
          <ThemedText type="title" size="small" weight="600" color={theme.Colors.white + 'CC'}>
            Needs: {activeOffer.title}
          </ThemedText>
          <ThemedText color={theme.Colors.primary} weight="800" style={styles.salaryText}>
            {activeOffer.salaryRange || '₹600 - ₹800'}
          </ThemedText>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.Colors.error }]} 
              onPress={rejectOffer}
            >
              <ThemedText style={{ fontSize: 24, color: '#fff' }}>✖</ThemedText>
              <ThemedText weight="700" color="#fff" style={styles.btnLabel}>Decline</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.Colors.success }]} 
              onPress={acceptOffer}
            >
              <ThemedText style={{ fontSize: 24, color: '#fff' }}>✔</ThemedText>
              <ThemedText weight="700" color="#fff" style={styles.btnLabel}>Approve</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', width: '100%', padding: 40 },
  incomingLabel: { letterSpacing: 2, marginBottom: 40, opacity: 0.7 },
  avatarContainer: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  pulseCircle: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, opacity: 0.3 },
  avatarBox: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', elevation: 12, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
  hirerName: { marginBottom: 8, textAlign: 'center' },
  salaryText: { fontSize: 24, marginTop: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 80 },
  actionBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  btnLabel: { marginTop: 4, fontSize: 12 }
});

export default IncomingOfferModal;
