import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { initI18n } from '../../i18n';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedButton } from '../../components/common/ThemedButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';

const { width } = Dimensions.get('window');

type AuthStep = 'LANGUAGE' | 'PHONE' | 'OTP' | 'ROLE' | 'PROFILE';

export const AuthScreen = () => {
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [isInitializing, setIsInitializing] = useState(true);
  const [phone, setPhone] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  
  // Profile State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [trade, setTrade] = useState<'skilled' | 'unskilled' | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRoleLocal] = useState<'worker' | 'hirer' | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [hiringCategory, setHiringCategory] = useState('');

  const { theme } = useTheme();
  const { signIn, verifyOTP, changeLanguage, updateProfile, selectRole } = useAuth();
  const { t } = useTranslation(['common', 'onboarding']);

  React.useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    await initI18n();
    const savedLng = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (!savedLng) {
      setStep('LANGUAGE');
    }
    setIsInitializing(false);
  };

  const handleBypass = async (role: 'worker' | 'hirer') => {
    try {
      setSelectedRoleLocal(role);
      await selectRole(role);
      await updateProfile({ 
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, 
        location: 'Mumbai, MH',
        isDemo: true 
      });
    } catch (e) {
      Alert.alert('Bypass Error', 'Could not skip verification');
    }
  };

  const handleNext = async () => {
    if (step === 'PHONE') {
      if (phone.length < 10) return Alert.alert('', 'Enter valid number');
      await signIn(phone);
      setStep('OTP');
    } else if (step === 'OTP') {
      if (otp.length < 4) return;
      try {
        await verifyOTP(otp);
        setStep('ROLE');
      } catch (e) {
        Alert.alert('Error', 'Use 123456');
      }
    }
  };

  const handleComplete = async () => {
    if (selectedRole === 'worker') {
      if (!name || !location || !trade || skills.length === 0) {
        return Alert.alert('', 'Please complete all worker fields');
      }
      await updateProfile({ name, location, trade: trade === 'skilled' ? 'Skilled' : 'Unskilled', categories: skills, workType: 'both' });
    } else {
      if (!businessName || !location || !hiringCategory) {
        return Alert.alert('', 'Please complete all hirer fields');
      }
      await updateProfile({ name: businessName, location, category: hiringCategory });
    }
  };

  const renderRole = () => (
    <View style={styles.centerStep}>
      <ThemedText type="headline" size="large" weight="800" style={styles.whatsappTitle}>I want to...</ThemedText>
      <View style={styles.roleGrid}>
        <TouchableOpacity 
          style={[styles.roleBox, { borderColor: theme.Colors.grey[200] }, selectedRole === 'worker' && { borderColor: theme.Colors.primary, backgroundColor: theme.Colors.primary + '10' }]}
          onPress={async () => { 
            setSelectedRoleLocal('worker');
            await selectRole('worker');
            setStep('PROFILE');
          }}
        >
          <ThemedText style={{ fontSize: 48 }}>👷</ThemedText>
          <ThemedText type="title" size="medium" weight="700">Find Work</ThemedText>
          <ThemedText type="label" style={{ opacity: 0.6 }}>I am a Worker</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.roleBox, { borderColor: theme.Colors.grey[200] }, selectedRole === 'hirer' && { borderColor: theme.Colors.secondary, backgroundColor: theme.Colors.secondary + '10' }]}
          onPress={async () => { 
            setSelectedRoleLocal('hirer');
            await selectRole('hirer');
            setStep('PROFILE');
          }}
        >
          <ThemedText style={{ fontSize: 48 }}>🏢</ThemedText>
          <ThemedText type="title" size="medium" weight="700">Hire Workers</ThemedText>
          <ThemedText type="label" style={{ opacity: 0.6 }}>I am a Hirer</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLanguage = () => (
    <View style={styles.centerStep}>
      <ThemedText type="headline" size="large" weight="800" style={styles.whatsappTitle}>WorkerD</ThemedText>
      <ThemedText type="body" style={styles.whatsappSubtitle}>Choose your language</ThemedText>
      <ScrollView contentContainerStyle={styles.tileScroll} showsVerticalScrollIndicator={false} style={{ width: '100%', flex: 1 }}>
        <View style={styles.tileContainer}>
          {[
            { c: 'hi', l: 'हिन्दी' },
            { c: 'mr', l: 'मরাঠি' },
            { c: 'en', l: 'English' },
            { c: 'bn', l: 'বাংলা' },
            { c: 'te', l: 'తెలుగు' },
            { c: 'ta', l: 'தமிழ்' },
            { c: 'gu', l: 'ગુજરાતી' },
            { c: 'kn', l: 'കടന്നഡ' },
            { c: 'ml', l: 'മലയാളം' },
            { c: 'pa', l: 'ਪੰਜਾਬੀ' },
            { c: 'ur', l: 'اردو' },
            { c: 'as', l: 'অসমীয়া' },
            { c: 'or', l: 'ଓଡ଼ିଆ' }
          ].map(item => (
            <TouchableOpacity 
              key={item.c} 
              style={[
                styles.langTile, 
                { backgroundColor: theme.Colors.surface, borderColor: theme.Colors.grey[200] },
                selectedLang === item.c && { borderColor: theme.Colors.primary, borderWidth: 2, backgroundColor: theme.Colors.primary + '10' }
              ]}
              onPress={() => setSelectedLang(item.c)}
            >
              <ThemedText type="title" size="large" weight="700" color={selectedLang === item.c ? theme.Colors.primary : theme.Colors.onBackground}>{item.l}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {selectedLang && (
        <TouchableOpacity 
          style={[styles.whatsappFab, { backgroundColor: theme.Colors.primary }]}
          onPress={async () => { 
            await changeLanguage(selectedLang); 
            setStep('PHONE'); 
          }}
        >
          <ThemedText style={{ color: theme.Colors.white, fontSize: 16, fontWeight: 'bold' }}>CONTINUE</ThemedText>
        </TouchableOpacity>
      )}
      <View style={styles.bypassArea}>
        <ThemedText style={styles.bypassText}>Developer Access:</ThemedText>
        <View style={styles.bypassRow}>
          <TouchableOpacity 
            style={[styles.bypassBtn, { backgroundColor: theme.Colors.primary + '20' }]}
            onPress={() => handleBypass('worker')}
          >
            <ThemedText color={theme.Colors.primary} weight="700">Worker Dashboard</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.bypassBtn, { backgroundColor: theme.Colors.secondary + '20' }]}
            onPress={() => handleBypass('hirer')}
          >
            <ThemedText color={theme.Colors.secondary} weight="700">Hirer Dashboard</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPhone = () => (
    <View style={styles.centerStep}>
      <ThemedText type="headline" size="large" weight="800" style={styles.whatsappTitle}>{t('onboarding:login_promo')}</ThemedText>
      <View style={[styles.whatsappInputWrapper, { borderBottomColor: theme.Colors.primary }]}>
        <ThemedText type="title" size="large" weight="700" style={{ marginRight: 15 }}>+91</ThemedText>
        <TextInput 
          style={[styles.whatsappInput, { color: theme.Colors.onBackground }]}
          placeholder="Mobile Number"
          placeholderTextColor={theme.Colors.grey[400]}
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          autoFocus
        />
      </View>
      <TouchableOpacity 
        style={[styles.whatsappFab, { backgroundColor: theme.Colors.primary }]}
        onPress={handleNext}
      >
        <ThemedText style={{ color: theme.Colors.white, fontSize: 24, fontWeight: 'bold' }}>{"\u2192"}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ marginTop: 20 }}
        onPress={() => setStep('LANGUAGE')}
      >
        <ThemedText color={theme.Colors.primary} weight="600">Change Language / ভাষা পরিবর্তন করুন</ThemedText>
      </TouchableOpacity>

      <View style={[styles.bypassArea, { marginTop: 40 }]}>
        <ThemedText style={styles.bypassText}>Developer Access:</ThemedText>
        <View style={styles.bypassRow}>
          <TouchableOpacity 
            style={[styles.bypassBtn, { backgroundColor: theme.Colors.primary + '20' }]}
            onPress={() => handleBypass('worker')}
          >
            <ThemedText color={theme.Colors.primary} weight="700">Worker DB</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.bypassBtn, { backgroundColor: theme.Colors.secondary + '20' }]}
            onPress={() => handleBypass('hirer')}
          >
            <ThemedText color={theme.Colors.secondary} weight="700">Hirer DB</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderOTP = () => (
    <View style={styles.centerStep}>
      <ThemedText type="headline" size="large" weight="800" style={styles.whatsappTitle}>Verify Number</ThemedText>
      <ThemedText type="body" style={styles.whatsappSubtitle}>Enter 6-digit code sent to +91 {phone}</ThemedText>
      <View style={styles.whatsappInputWrapper}>
        <TextInput 
          style={[styles.whatsappInput, { letterSpacing: 10, textAlign: 'center', fontSize: 28, borderBottomWidth: 2, borderBottomColor: theme.Colors.primary, color: theme.Colors.onBackground }]}
          placeholder="000000"
          placeholderTextColor={theme.Colors.grey[300]}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          autoFocus
        />
      </View>
      <TouchableOpacity 
        style={[styles.whatsappFab, { backgroundColor: theme.Colors.primary }]}
        onPress={handleNext}
      >
        <ThemedText style={{ color: theme.Colors.white, fontSize: 24, fontWeight: 'bold' }}>{"\u2713"}</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.profileContainer} showsVerticalScrollIndicator={false}>
      <ThemedText type="headline" size="medium" weight="800" style={styles.whatsappTitle}>{selectedRole === 'worker' ? 'Worker Profile' : 'Hirer Profile'}</ThemedText>
      
      {selectedRole === 'worker' ? (
        <>
          <TextInput 
            style={[styles.underlineInput, { color: theme.Colors.onBackground, borderBottomColor: theme.Colors.grey[300] }]}
            placeholder="Your Full Name"
            placeholderTextColor={theme.Colors.grey[400]}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity 
            style={[styles.locationBtn, { backgroundColor: theme.Colors.primary + '10' }]}
            onPress={() => setLocation('Andheri West, Mumbai')}
          >
            <ThemedText color={theme.Colors.primary} weight="600">📍 {location || 'Detect My Location'}</ThemedText>
          </TouchableOpacity>

          <View style={styles.roleGrid}>
            <TouchableOpacity 
              style={[styles.roleBox, { borderColor: theme.Colors.grey[200] }, trade === 'skilled' && { borderColor: theme.Colors.primary, backgroundColor: theme.Colors.primary + '10' }]}
              onPress={() => setTrade('skilled')}
            >
              <ThemedText style={{ fontSize: 32 }}>🔵</ThemedText>
              <ThemedText type="label" size="medium" weight="700">Skilled</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleBox, { borderColor: theme.Colors.grey[200] }, trade === 'unskilled' && { borderColor: theme.Colors.secondary, backgroundColor: theme.Colors.secondary + '10' }]}
              onPress={() => setTrade('unskilled')}
            >
              <ThemedText style={{ fontSize: 32 }}>🟡</ThemedText>
              <ThemedText type="label" size="medium" weight="700">Unskilled</ThemedText>
            </TouchableOpacity>
          </View>

          {trade && (
            <View style={styles.skillsArea}>
              { (trade === 'skilled' ? ['Electrician', 'Plumber', 'Driver'] : ['Labour', 'Loader', 'Cleaner']).map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[styles.whatsappChip, { borderColor: theme.Colors.grey[200] }, skills.includes(s) && { backgroundColor: theme.Colors.primary, borderColor: theme.Colors.primary }]}
                  onPress={() => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                >
                  <ThemedText type="label" size="small" weight="600" style={{ color: skills.includes(s) ? theme.Colors.white : theme.Colors.onBackground }}>{s}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      ) : (
        <>
          <TextInput 
            style={[styles.underlineInput, { color: theme.Colors.onBackground, borderBottomColor: theme.Colors.grey[300] }]}
            placeholder="Business / Company Name"
            placeholderTextColor={theme.Colors.grey[400]}
            value={businessName}
            onChangeText={setBusinessName}
          />
          
          <TextInput 
            style={[styles.underlineInput, { color: theme.Colors.onBackground, borderBottomColor: theme.Colors.grey[300] }]}
            placeholder="Hiring Category (e.g. Construction)"
            placeholderTextColor={theme.Colors.grey[400]}
            value={hiringCategory}
            onChangeText={setHiringCategory}
          />

          <TouchableOpacity 
            style={[styles.locationBtn, { backgroundColor: theme.Colors.secondary + '10' }]}
            onPress={() => setLocation('Andheri West, Mumbai')}
          >
            <ThemedText color={theme.Colors.secondary} weight="600">📍 {location || 'Business Location'}</ThemedText>
          </TouchableOpacity>
        </>
      )}

      <ThemedButton 
        title="START WORKING" 
        onPress={handleComplete}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );

  if (isInitializing) return null;

  return (
    <ThemedView style={styles.container}>
      {step === 'LANGUAGE' && renderLanguage()}
      {step === 'PHONE' && renderPhone()}
      {step === 'OTP' && renderOTP()}
      {step === 'ROLE' && renderRole()}
      {step === 'PROFILE' && renderProfile()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30 },
  centerStep: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  whatsappTitle: { marginBottom: 10, textAlign: 'center' },
  whatsappSubtitle: { marginBottom: 20, opacity: 0.6, textAlign: 'center' },
  tileScroll: { width: '100%', paddingBottom: 100 },
  tileContainer: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  langTile: { width: '47%', paddingVertical: 20, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  whatsappInputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', paddingBottom: 10, marginTop: 20 },
  whatsappInput: { flex: 1, fontSize: 24, padding: 0 },
  whatsappFab: { position: 'absolute', bottom: 30, right: 30, paddingHorizontal: 20, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  profileContainer: { paddingTop: 60, gap: 30 },
  underlineInput: { fontSize: 20, borderBottomWidth: 1, paddingVertical: 10 },
  locationBtn: { padding: 18, borderRadius: 12, alignItems: 'center' },
  roleGrid: { flexDirection: 'row', gap: 15 },
  roleBox: { flex: 1, padding: 25, borderRadius: 16, borderWidth: 2, alignItems: 'center', gap: 10 },
  skillsArea: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  whatsappChip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, borderWidth: 1 },
  bypassArea: { width: '100%', alignItems: 'center', marginTop: 20 },
  bypassText: { fontSize: 12, opacity: 0.5, marginBottom: 10 },
  bypassRow: { flexDirection: 'row', gap: 10 },
  bypassBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
});

export default AuthScreen;
