import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedInput } from '../../components/common/ThemedInput';
import { ThemedButton } from '../../components/common/ThemedButton';
import { ThemedCard } from '../../components/common/ThemedCard';
import { BilingualText } from '../../components/common/BilingualText';
import { useTheme } from '../../hooks/useTheme';
import { Project } from '../../types';
import * as workerService from '../../api/workerService';
import * as jobApplicationService from '../../api/jobApplicationService';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { profile, userRole, updateProfile, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', location: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ applied: 0, rating: 0, earnings: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (profile?.id) {
          const [profileData, countData, appsData] = await Promise.all([
            workerService.getWorkerProfile(profile.id),
            jobApplicationService.getApplicantCount(),
            jobApplicationService.getMyApplications()
          ]);
          setStats({
            applied: countData,
            rating: profileData.rating || 4.8,
            earnings: appsData
              .filter(a => a.status === 'COMPLETED')
              .reduce((sum, a) => sum + (a.bidAmount || 0), 0)
          });
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile?.id, userRole]);

  const getVerificationConfig = () => {
    switch (profile?.verificationStatus) {
      case 'verified':
        return { icon: '✅', color: theme.Colors.success, label: t('verified'), labelHi: 'सत्यापित', bg: '#E8F5E9' };
      case 'pending':
        return { icon: '⏳', color: theme.Colors.warning, label: t('pending_status'), labelHi: 'विचाराधीन', bg: '#FFF8E1' };
      default:
        return { icon: '❌', color: theme.Colors.error, label: t('unverified'), labelHi: 'असत्यापित', bg: '#FFEBEE' };
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.location) {
      return Alert.alert('Error', 'Please enter project name and location');
    }
    const projects = [...(profile?.projects || [])];
    const projectWithId = { ...newProject, id: Date.now().toString() };
    projects.push(projectWithId);
    await updateProfile({ projects });
    setNewProject({ name: '', location: '', description: '' });
    setIsProjectModalVisible(false);
    Alert.alert('Success', 'Project added successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out / लॉग आउट',
      'Are you sure? / क्या आप वाकई लॉग आउट करना चाहते हैं?',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('log_out'), style: 'destructive', onPress: signOut },
      ]
    );
  };

  const verConfig = getVerificationConfig();

  const renderWorkerProfile = () => (
    <>
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.Colors.primary + '12' }]}>
          <ThemedText style={{ fontSize: 22 }}>📝</ThemedText>
          <ThemedText type="title" size="medium" weight="800" color={theme.Colors.primary}>
            {stats.applied}
          </ThemedText>
          <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>
            {t('applied')} / आवेदन
          </ThemedText>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.Colors.success + '12' }]}>
          <ThemedText style={{ fontSize: 22 }}>⭐</ThemedText>
          <ThemedText type="title" size="medium" weight="800" color={theme.Colors.success}>
            {stats.rating.toFixed(1)}
          </ThemedText>
          <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>
            {t('ratings')} / रेटिंग
          </ThemedText>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.Colors.warning + '12' }]}>
          <ThemedText style={{ fontSize: 22 }}>💰</ThemedText>
          <ThemedText type="title" size="medium" weight="800" color={theme.Colors.warning}>
            ₹{stats.earnings}
          </ThemedText>
          <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>
            {t('earning')} / कमाई
          </ThemedText>
        </View>
      </View>

      {/* Work Details Section */}
      <View style={styles.section}>
        <BilingualText
          primary={t('work_details')}
          secondary="कार्य विवरण"
          type="title"
          size="medium"
          weight="700"
          icon="🔧"
          style={styles.sectionTitle}
        />
        <ThemedCard style={styles.infoCard}>
          {/* Trade */}
          <ThemedInput
            label={t('primary_trade')}
            placeholder={t('enter_trade')}
            value={profile?.trade}
            onChangeText={(val) => updateProfile({ trade: val })}
          />

          <View style={{ height: 12 }} />

          {/* Location */}
          <ThemedInput
            label={t('location')}
            placeholder={t('enter_location')}
            value={profile?.location}
            onChangeText={(val) => updateProfile({ location: val })}
          />

          <View style={[styles.divider, { backgroundColor: theme.Colors.grey[100] }]} />

          {/* Verification Status */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <ThemedText style={{ fontSize: 18 }}>{verConfig.icon}</ThemedText>
              <View>
                <ThemedText color={theme.Colors.grey[500]}>{t('verification')}</ThemedText>
                <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>सत्यापन</ThemedText>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: verConfig.bg }]}>
              <ThemedText type="label" size="small" weight="700" color={verConfig.color}>
                {verConfig.label} / {verConfig.labelHi}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </View>

      {/* Prominent Verify CTA */}
      {profile?.verificationStatus !== 'verified' && (
        <TouchableOpacity
          style={[styles.verifyCta, { backgroundColor: theme.Colors.success }]}
          onPress={() => navigation.navigate('Verification')}
          activeOpacity={0.8}
          accessibilityLabel="Verify your profile"
        >
          <ThemedText style={{ fontSize: 24, marginRight: 12 }}>🛡️</ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText weight="700" style={{ color: '#fff', fontSize: 16 }}>
              {t('verify_now')}
            </ThemedText>
            <ThemedText weight="500" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              अभी सत्यापित करें — अधिक काम पाएं
            </ThemedText>
          </View>
          <ThemedText style={{ fontSize: 20, color: '#fff' }}>→</ThemedText>
        </TouchableOpacity>
      )}
    </>
  );

  const renderHirerProfile = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BilingualText
            primary="Company & Projects"
            secondary="कंपनी और प्रोजेक्ट"
            type="title"
            size="medium"
            weight="700"
            icon="🏢"
          />
          <TouchableOpacity onPress={() => setIsProjectModalVisible(true)}>
            <ThemedText color={theme.Colors.primary} weight="700">+ Add</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedCard style={styles.infoCard}>
          <ThemedInput
            label="Company Name"
            placeholder="Enter your company or site name"
            value={profile?.companyName}
            onChangeText={(val) => updateProfile({ companyName: val })}
          />
          <ThemedInput
            label="Default Site Location"
            placeholder="e.g. Mumbai, Navi Mumbai"
            value={profile?.companyLocation}
            onChangeText={(val) => updateProfile({ companyLocation: val })}
          />
        </ThemedCard>

        <ThemedText type="title" size="small" weight="700" style={{ marginTop: 20, marginBottom: 12 }}>My Projects</ThemedText>
        {profile?.projects && profile.projects.length > 0 ? (
          profile.projects.map((project: Project) => (
            <ThemedCard key={project.id} style={styles.projectCard} elevation={1}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText weight="700">{project.name}</ThemedText>
                <ThemedText size="small" color={theme.Colors.grey[500]}>{project.location}</ThemedText>
              </View>
              <ThemedText size="small" style={{ marginTop: 4, opacity: 0.7 }}>{project.description}</ThemedText>
            </ThemedCard>
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={{ fontSize: 40 }}>🏗️</ThemedText>
            <ThemedText color={theme.Colors.grey[400]}>No projects added yet.</ThemedText>
          </View>
        )}
      </View>
    </>
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header — Larger avatar with gradient ring */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarRing, { borderColor: theme.Colors.primary + '40' }]}>
            <View style={[styles.avatar, { backgroundColor: theme.Colors.primary + '15' }]}>
              <ThemedText style={{ fontSize: 48 }}>{userRole === 'worker' ? '👷' : '🏢'}</ThemedText>
            </View>
          </View>
          <ThemedText type="headline" size="medium" weight="800" style={{ marginTop: 12 }}>
            {profile?.name || 'User Name'}
          </ThemedText>
          <BilingualText
            primary={userRole === 'worker' ? t('worker_account') : t('hirer_account')}
            secondary={userRole === 'worker' ? 'कामगार खाता' : 'नियोक्ता खाता'}
            type="label"
            size="medium"
            weight="600"
            color={theme.Colors.grey[400]}
            align="center"
            style={{ marginTop: 4 }}
          />
        </View>

        {userRole === 'worker' ? renderWorkerProfile() : renderHirerProfile()}

        {/* Log Out — with icon and confirmation */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.Colors.error + '30' }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <ThemedText style={{ fontSize: 20, marginRight: 8 }}>🚪</ThemedText>
          <BilingualText
            primary={t('log_out')}
            secondary="लॉग आउट"
            type="label"
            size="medium"
            weight="700"
            color={theme.Colors.error}
          />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Project Modal */}
      <Modal visible={isProjectModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" size="medium" weight="800" style={{ marginBottom: 20 }}>Add New Project</ThemedText>

            <ThemedInput
              label="Project Name"
              placeholder="e.g. Skyline Residency Tower A"
              value={newProject.name}
              onChangeText={(val) => setNewProject({ ...newProject, name: val })}
            />
            <ThemedInput
              label="Location"
              placeholder="e.g. Worli, Mumbai"
              value={newProject.location}
              onChangeText={(val) => setNewProject({ ...newProject, location: val })}
            />
            <ThemedInput
              label="Brief Description"
              placeholder="Type of work, duration, etc."
              multiline
              numberOfLines={3}
              value={newProject.description}
              onChangeText={(val) => setNewProject({ ...newProject, description: val })}
              style={{ height: 80, textAlignVertical: 'top' }}
            />

            <View style={styles.modalButtons}>
              <ThemedButton
                title={t('cancel')}
                variant="outlined"
                style={{ flex: 1 }}
                onPress={() => setIsProjectModalVisible(false)}
              />
              <View style={{ width: 12 }} />
              <ThemedButton
                title={t('save')}
                style={{ flex: 1 }}
                onPress={handleAddProject}
              />
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  profileHeader: { alignItems: 'center', marginTop: 36, marginBottom: 28 },
  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
  },
  section: { marginTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { marginBottom: 14 },
  infoCard: { padding: 20, borderRadius: 24 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    borderRadius: 1,
    marginVertical: 4,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  verifyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginTop: 20,
  },
  projectCard: { padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  emptyState: { padding: 40, alignItems: 'center', gap: 8, opacity: 0.6 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  modalButtons: { flexDirection: 'row', marginTop: 20 },
});

export default ProfileScreen;
