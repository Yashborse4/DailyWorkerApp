import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import {
  DashboardHeader,
  StatsCard,
  QuickActionButton,
  SectionHeader,
  JobCard,
} from '../../components/dashboard';
import * as jobService from '../../api/jobService';
import * as jobApplicationService from '../../api/jobApplicationService';
import * as notificationService from '../../api/notificationService';
import { ActivityIndicator } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * HirerDashboard — Premium redesigned dashboard for hirers.
 *
 * Features:
 * - Time-aware greeting header with company avatar
 * - Glassmorphic Hiring Pipeline banner
 * - Prominent "Post Job" CTA with horizontal pill layout
 * - Staggered stats cards
 * - Rich job post cards with status badges and applicant chips
 * - Quick Actions (Browse Workers, Messages) as pills
 */
export const HirerDashboard = () => {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = React.useState(true);
  const [jobs, setJobs] = React.useState<jobService.Job[]>([]);
  const [applicantCount, setApplicantCount] = React.useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, count, sCount, notifs] = await Promise.all([
          jobService.getMyJobs(),
          jobApplicationService.getApplicantCount(),
          jobApplicationService.getShortlistedCount(),
          notificationService.getUnreadCount()
        ]);
        setJobs(jobsData);
        setApplicantCount(count);
        setShortlistedCount(sCount);
        setUnreadNotifications(notifs);
      } catch (error) {
        console.error('Error fetching hirer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Derived Data ──────────────────────────────────────
  const stats = [
    { label: 'Live Jobs', value: jobs.filter(j => j.status === 'PUBLISHED').length.toString(), icon: '📡', color: theme.Colors.hirer.base },
    { label: 'Applicants', value: applicantCount.toString(), icon: '👥', color: theme.Colors.secondary },
    { label: 'Shortlisted', value: shortlistedCount.toString(), icon: '✅', color: '#27ae60' },
  ];

  const pipelineData = [
    { label: 'Active', value: jobs.filter(j => j.status === 'PUBLISHED').length.toString(), color: theme.Colors.hirer.base },
    { label: 'Filled', value: jobs.filter(j => j.status === 'COMPLETED').length.toString(), color: theme.Colors.secondary },
    { label: 'Pending', value: jobs.filter(j => j.status === 'DRAFT').length.toString(), color: theme.Colors.warning },
  ];

  const recentPosts = jobs.slice(0, 3).map(j => ({
    id: j.id.toString(),
    title: j.title,
    date: new Date(j.createdAt).toLocaleDateString(),
    apps: (j as any).applicantCount || 0,
    status: j.status,
    icon: '🛠️'
  }));

  // ── Stagger timing ───────────────────────────────────
  const BASE_DELAY = 100;
  const STAGGER = 80;

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.Colors.hirer.base} />
      </ThemedView>
    );
  }

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
          name={profile?.name || 'Sir'}
          subtitle="Manage your hires and active posts"
          avatarColor={theme.Colors.hirer.base}
          avatarIcon="🏢"
          showNotificationBell
          notificationCount={unreadNotifications}
          onNotificationPress={() => {}}
          onAvatarPress={() => navigation.navigate('Profile')}
        />

        {/* ── Hiring Pipeline Banner ─────────────────── */}
        <View
          style={[
            styles.pipelineCard,
            {
              backgroundColor: theme.Colors.hirer.base,
              ...Platform.select({
                ios: {
                  shadowColor: theme.Colors.hirer.base,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 20,
                },
                android: { elevation: 8 },
              }),
            },
          ]}
        >
          {/* Decorative circles */}
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />

          <ThemedText weight="800" style={styles.pipelineTitle}>
            Hiring Pipeline
          </ThemedText>
          <ThemedText weight="500" style={styles.pipelineSubtitle}>
            Real-time overview of your positions
          </ThemedText>

          <View style={styles.pipelineGrid}>
            {pipelineData.map((item, index) => (
              <View key={item.label} style={styles.pipelineItem}>
                <ThemedText weight="800" style={styles.pipelineValue}>
                  {item.value}
                </ThemedText>
                <ThemedText weight="600" style={styles.pipelineLabel}>
                  {item.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* ── Post Job CTA ───────────────────────────── */}
        <View style={styles.ctaRow}>
          <QuickActionButton
            icon="➕"
            label="Post a New Job"
            backgroundColor={theme.Colors.hirer.base}
            gradientColor={theme.Colors.hirer.dark}
            delay={BASE_DELAY}
            onPress={() => navigation.navigate('PostJob')}
          />
        </View>

        {/* ── Stats Grid ─────────────────────────────── */}
        <SectionHeader title="Overview" actionColor={theme.Colors.hirer.base} />
        <View style={styles.statsRow}>
          {stats.map((item, index) => (
            <StatsCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={item.label}
              accentColor={item.color}
              delay={BASE_DELAY + STAGGER * (index + 1)}
            />
          ))}
        </View>

        {/* ── Recent Job Posts ────────────────────────── */}
        <SectionHeader
          title="Recent Job Posts"
          actionLabel="View All"
          actionColor={theme.Colors.hirer.base}
          onActionPress={() => navigation.navigate('MyJobs')}
        />

        {recentPosts.map((post, index) => (
          <JobCard
            key={post.id}
            title={post.title}
            subtitle={`Posted ${post.date}`}
            icon={post.icon}
            status={post.status}
            statusActive={post.status === 'Active'}
            accentColor={theme.Colors.hirer.base}
            footerLabel={`👥 ${post.apps} Applications`}
            footerAction="Manage"
            onFooterAction={() => {}}
            delay={BASE_DELAY + STAGGER * (4 + index)}
            onPress={() => {}}
          />
        ))}

        {/* ── Quick Actions ──────────────────────────── */}
        <SectionHeader title="Quick Actions" actionColor={theme.Colors.hirer.base} />
        <View style={styles.actionRow}>
          <QuickActionButton
            icon="👥"
            label="Browse Workers"
            backgroundColor={theme.Colors.hirer.base}
            gradientColor="#047857"
            delay={BASE_DELAY + STAGGER * 8}
            onPress={() => {}}
          />
          <QuickActionButton
            icon="💬"
            label="Messages"
            backgroundColor={theme.Colors.secondary}
            gradientColor="#0d7377"
            delay={BASE_DELAY + STAGGER * 9}
            onPress={() => navigation.navigate('ChatList')}
          />
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 60 }} />
      </ScrollView>
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
  // Pipeline Banner
  pipelineCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorCircle1: {
    width: 130,
    height: 130,
    top: -35,
    right: -25,
  },
  decorCircle2: {
    width: 80,
    height: 80,
    bottom: -20,
    left: -10,
  },
  pipelineTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 4,
  },
  pipelineSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 20,
  },
  pipelineGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  pipelineItem: {
    alignItems: 'center',
    gap: 4,
  },
  pipelineValue: {
    color: '#fff',
    fontSize: 24,
  },
  pipelineLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  // CTA
  ctaRow: {
    marginBottom: 24,
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
});

export default HirerDashboard;
