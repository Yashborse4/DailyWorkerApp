import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useJobOffer } from '../../context/JobOfferContext';
import {
  DashboardHeader,
  StatsCard,
  QuickActionButton,
  SectionHeader,
  VerificationBanner,
  JobCard,
} from '../../components/dashboard';
import * as workerService from '../../api/workerService';
import * as jobService from '../../api/jobService';
import * as jobApplicationService from '../../api/jobApplicationService';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * WorkerDashboard — Premium redesigned dashboard for workers.
 *
 * Features:
 * - Time-aware bilingual greeting header
 * - Animated verification banner (if unverified)
 * - Frosted-glass earnings summary card with bilingual labels
 * - Staggered stats cards with bilingual labels
 * - Horizontal pill quick actions
 * - Rich job cards with pay chips
 * - Repositioned floating demo simulation button
 */
export const WorkerDashboard = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { receiveOffer } = useJobOffer();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = React.useState(true);
  const [workerProfile, setWorkerProfile] = React.useState<workerService.WorkerProfile | null>(null);
  const [jobs, setJobs] = React.useState<jobService.Job[]>([]);
  const [appliedCount, setAppliedCount] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (profile?.id) {
          const [profileData, appsData] = await Promise.all([
            workerService.getWorkerProfile(profile.id),
            jobApplicationService.getMyApplications()
          ]);
          setWorkerProfile(profileData);
          setAppliedCount(appsData.length);
        }
        const jobsData = await jobService.getJobs();
        setJobs(jobsData.slice(0, 3)); // Only show top 3 on dashboard
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile?.id]);

  // ── Derived Data ──────────────────────────────────────
  const stats = [
    { 
      label: `${t('applied')}`, 
      labelHi: 'आवेदन', 
      value: appliedCount.toString(), 
      icon: '📝', 
      color: theme.Colors.primary 
    },
    { 
      label: `${t('earning')}`, 
      labelHi: 'कमाई', 
      value: `₹${(workerProfile?.completedJobsCount || 0) * 500}`, 
      icon: '💰', 
      color: theme.Colors.secondary 
    },
    { 
      label: `${t('ratings')}`, 
      labelHi: 'रेटिंग', 
      value: workerProfile?.rating?.toFixed(1) || '0.0', 
      icon: '⭐', 
      color: theme.Colors.warning 
    },
  ];

  const recentJobs = jobs.map(j => ({
    id: j.id.toString(),
    title: j.title,
    location: j.location,
    pay: `₹${j.budget}`,
    type: j.category,
    icon: '🛠️' // Default icon
  }));

  const isUnverified = !profile?.verificationStatus || profile.verificationStatus === 'unverified';

  // ── Stagger timing ───────────────────────────────────
  const BASE_DELAY = 100;
  const STAGGER = 80;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: SCREEN_WIDTH > 400 ? 24 : 16 },
        ]}
      >
        {/* ── Header ─────────────────────────────────── */}
        <DashboardHeader
          name={profile?.name || 'Worker'}
          subtitle={`${profile?.location || 'Mumbai, India'} • ${profile?.trade || 'Skilled'}`}
          emoji="🙏"
          avatarColor={theme.Colors.primary}
          avatarIcon="👤"
          showNotificationBell
          notificationCount={3}
          onNotificationPress={() => {}}
          onAvatarPress={() => navigation.navigate('Profile')}
        />

        {/* ── Verification Banner ────────────────────── */}
        {isUnverified && (
          <VerificationBanner
            title={`${t('verify_now')} / अभी सत्यापित करें`}
            subtitle="Unlock high-paying jobs / ज़्यादा पैसे वाले काम पाएं"
            ctaLabel={`${t('verify_now')}`}
            delay={BASE_DELAY}
            onPress={() => navigation.navigate('Verification')}
          />
        )}

        {/* ── Earnings Summary Card ──────────────────── */}
        <View
          style={[
            styles.earningsCard,
            {
              backgroundColor: theme.Colors.surface,
              borderColor: theme.Colors.secondary + '20',
              ...Platform.select({
                ios: {
                  shadowColor: theme.Colors.secondary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                },
                android: { elevation: 3 },
              }),
            },
          ]}
        >
          <View style={styles.earningsRow}>
            <View>
              <ThemedText type="label" size="medium" weight="600" color={theme.Colors.grey[400]}>
                {t('this_month_earnings')}
              </ThemedText>
              <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                इस महीने की कमाई
              </ThemedText>
              <ThemedText type="headline" size="small" weight="800" color={theme.Colors.secondary} style={styles.earningsValue}>
                ₹{(workerProfile?.completedJobsCount || 0) * 500}
              </ThemedText>
            </View>
            <View style={[styles.earningsIcon, { backgroundColor: theme.Colors.secondary + '15' }]}>
              <ThemedText style={{ fontSize: 28 }}>💸</ThemedText>
            </View>
          </View>
          <View style={[styles.earningsDivider, { backgroundColor: theme.Colors.grey[100] }]} />
          <View style={styles.earningsMeta}>
            <View style={styles.earningsMetaItem}>
              <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
                {t('jobs_done')}
              </ThemedText>
              <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                पूरे किए
              </ThemedText>
              <ThemedText type="title" size="small" weight="800" color={theme.Colors.primary}>
                {workerProfile?.completedJobsCount || 0}
              </ThemedText>
            </View>
            <View style={[styles.earningsMetaDivider, { backgroundColor: theme.Colors.grey[100] }]} />
            <View style={styles.earningsMetaItem}>
              <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
                {t('avg_per_job')}
              </ThemedText>
              <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                औसत
              </ThemedText>
              <ThemedText type="title" size="small" weight="800" color={theme.Colors.warning}>
                ₹500
              </ThemedText>
            </View>
            <View style={[styles.earningsMetaDivider, { backgroundColor: theme.Colors.grey[100] }]} />
            <View style={styles.earningsMetaItem}>
              <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
                {t('pending')}
              </ThemedText>
              <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                बाकी
              </ThemedText>
              <ThemedText type="title" size="small" weight="800" color={theme.Colors.error}>
                ₹0
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ── Stats Grid ─────────────────────────────── */}
        <SectionHeader title={t('overview')} subtitle="सारांश" />
        <View style={styles.statsRow}>
          {stats.map((item, index) => (
            <StatsCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={`${item.label}\n${item.labelHi}`}
              accentColor={item.color}
              delay={BASE_DELAY + STAGGER * (index + 1)}
            />
          ))}
        </View>

        {/* ── Quick Actions ──────────────────────────── */}
        <SectionHeader title={t('quick_actions')} subtitle="त्वरित कार्य" />
        <View style={styles.actionRow}>
          <QuickActionButton
            icon="🔍"
            label={`${t('find_jobs')}\nकाम ढूंढें`}
            backgroundColor={theme.Colors.primary}
            gradientColor={theme.Colors.primaryVariant}
            delay={BASE_DELAY + STAGGER * 5}
            onPress={() => navigation.navigate('FindJobs')}
          />
          <QuickActionButton
            icon="📅"
            label={`${t('my_tasks')}\nमेरे काम`}
            backgroundColor={theme.Colors.secondary}
            gradientColor="#0d7377"
            delay={BASE_DELAY + STAGGER * 6}
            onPress={() => {}}
          />
        </View>

        {/* ── Recommended Jobs ───────────────────────── */}
        <SectionHeader
          title={t('recommended_for_you')}
          subtitle="आपके लिए सुझाव"
          actionLabel={`${t('see_all')} →`}
          onActionPress={() => navigation.navigate('FindJobs')}
        />
        {recentJobs.map((job, index) => (
          <JobCard
            key={job.id}
            title={job.title}
            subtitle={`${job.location} • ${job.type}`}
            pay={job.pay}
            icon={job.icon}
            accentColor={theme.Colors.primary}
            delay={BASE_DELAY + STAGGER * (7 + index)}
            onPress={() => navigation.navigate('FindJobs')}
          />
        ))}

        {/* Bottom spacer for FAB clearance */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Floating Demo Button — repositioned with safe padding ─── */}
      <TouchableOpacity
        style={[
          styles.simBtn,
          {
            backgroundColor: theme.Colors.warning,
            shadowColor: theme.Colors.warning,
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          receiveOffer({
            id: 'mock-1',
            title: 'Emergency Plumbing',
            description: 'Serious leak in main pipe. Need someone immediately.',
            location: 'Andheri West',
            salaryRange: '₹1200 - ₹1500',
            postedBy: 'Skyline Reality',
            category: 'Skilled',
            hiringEntity: 'Building Construction',
            startDate: '27/03/2026',
            endDate: '28/03/2026',
            createdAt: new Date().toISOString(),
          })
        }
        accessibilityLabel="Simulate incoming job offer"
      >
        <ThemedText style={{ fontSize: 24 }}>📞</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // Earnings Card
  earningsCard: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 28,
    borderWidth: 1.5,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsValue: {
    marginTop: 6,
  },
  earningsIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsDivider: {
    height: 1,
    marginVertical: 16,
    borderRadius: 1,
  },
  earningsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsMetaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  earningsMetaDivider: {
    width: 1,
    height: 40,
    borderRadius: 1,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 32,
  },
  // FAB — repositioned to not overlap content
  simBtn: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
});

export default WorkerDashboard;
