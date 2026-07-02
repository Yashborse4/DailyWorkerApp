import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { useTheme } from '../../hooks/useTheme';
import * as jobService from '../../api/jobService';
import * as jobApplicationService from '../../api/jobApplicationService';
import { useToast } from '../../context/ToastContext';

const JOB_ICONS: Record<string, { icon: string; color: string }> = {
  'Home Cleaning': { icon: 'brush-outline', color: '#0F766E' },
  'Electrical Repair': { icon: 'flash-outline', color: '#D97706' },
  'Construction Labour': { icon: 'hammer-outline', color: '#DC2626' },
  'Pest Control': { icon: 'bug-outline', color: '#7C3AED' },
  'Warehouse Helper': { icon: 'cube-outline', color: '#2563EB' },
  'Delivery Partner': { icon: 'bicycle-outline', color: '#0891B2' },
  Plumbing: { icon: 'water-outline', color: '#475569' },
  Painting: { icon: 'color-palette-outline', color: '#DB2777' },
};

const TYPE_CONFIG: Record<string, { color: string; bg: string; hi: string }> = {
  Light: { color: '#047857', bg: '#DFF7EA', hi: 'हल्का' },
  Skilled: { color: '#B45309', bg: '#FEF3C7', hi: 'कुशल' },
  Heavy: { color: '#B91C1C', bg: '#FEE2E2', hi: 'भारी' },
  Unskilled: { color: '#1D4ED8', bg: '#DBEAFE', hi: 'सामान्य' },
};

const FILTERS = ['All', 'Skilled', 'Light', 'Heavy', 'Unskilled'];

const AnimatedJobCard = React.memo(({
  item,
  index,
  applying,
  onApply,
}: {
  item: jobService.Job;
  index: number;
  applying: boolean;
  onApply: (job: jobService.Job) => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const entrance = React.useRef(new Animated.Value(0)).current;
  const press = React.useRef(new Animated.Value(1)).current;
  const jobIcon = JOB_ICONS[item.title] || { icon: 'construct-outline', color: theme.Colors.primary };
  const typeConfig = TYPE_CONFIG[item.category] || TYPE_CONFIG.Skilled;

  React.useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 420,
      delay: Math.min(index, 8) * 55,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance, index]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const setPressed = (pressed: boolean) => {
    Animated.spring(press, {
      toValue: pressed ? 0.985 : 1,
      tension: 260,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: entrance, transform: [{ translateY }, { scale: press }] }}>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          styles.jobCard,
          {
            backgroundColor: theme.Colors.surface,
            borderColor: theme.Colors.grey[100],
            shadowColor: jobIcon.color,
          },
        ]}
      >
        <View style={styles.jobTopRow}>
          <View style={[styles.iconBox, { backgroundColor: jobIcon.color + '16' }]}>
            {jobIcon.icon.length > 2 ? (
              <Ionicons name={jobIcon.icon} size={24} color={jobIcon.color} />
            ) : (
              <ThemedText style={styles.iconText}>{jobIcon.icon}</ThemedText>
            )}
          </View>

          <View style={styles.jobInfo}>
            <ThemedText type="title" size="medium" weight="800" numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText type="body" size="small" color={theme.Colors.grey[500]} numberOfLines={1}>
              {item.location}
            </ThemedText>
          </View>

          <View style={[styles.payPill, { backgroundColor: theme.Colors.success + '14' }]}>
            <ThemedText type="label" size="small" weight="800" color={theme.Colors.success}>
              ₹{item.budget}
            </ThemedText>
            <ThemedText style={[styles.payMeta, { color: theme.Colors.success }]}>job</ThemedText>
          </View>
        </View>

        <View style={styles.jobMetaRow}>
          <View style={[styles.typePill, { backgroundColor: typeConfig.bg }]}>
            <View style={[styles.typeDot, { backgroundColor: typeConfig.color }]} />
            <ThemedText type="label" size="small" weight="800" color={typeConfig.color}>
              {item.category}
            </ThemedText>
          </View>
          <ThemedText type="label" size="small" weight="700" color={theme.Colors.grey[400]}>
            Posted {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: theme.Colors.primary }]}
          activeOpacity={0.85}
          onPress={() => onApply(item)}
          disabled={applying}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText weight="800" style={styles.applyText}>
              {t('common:apply_now')}
            </ThemedText>
          )}
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
});

export const FindJobsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [jobs, setJobs] = React.useState<jobService.Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [applying, setApplying] = React.useState<number | null>(null);
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [isBidModalVisible, setIsBidModalVisible] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<jobService.Job | null>(null);
  const [bidAmount, setBidAmount] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('I am interested in this job.');
  const headerAnim = React.useRef(new Animated.Value(0)).current;

  const fetchJobs = React.useCallback(async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showToast({ message: 'Could not load jobs. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    fetchJobs();
  }, [fetchJobs, headerAnim]);

  const filteredJobs = React.useMemo(() => {
    if (activeFilter === 'All') {
      return jobs;
    }
    return jobs.filter(job => job.category === activeFilter);
  }, [activeFilter, jobs]);

  const openBidModal = React.useCallback((job: jobService.Job) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
    setCoverLetter('I am interested in this job.');
    setIsBidModalVisible(true);
  }, []);

  const handleApply = async () => {
    if (!selectedJob) return;

    const finalBid = parseInt(bidAmount, 10);
    if (Number.isNaN(finalBid) || finalBid <= 0) {
      Alert.alert('Invalid Bid', 'Please enter a valid amount.');
      return;
    }

    setApplying(selectedJob.id);
    setIsBidModalVisible(false);

    try {
      await jobApplicationService.applyForJob(selectedJob.id, {
        bidAmount: finalBid,
        coverLetter,
      });
      showToast({ message: 'Applied successfully!', type: 'success' });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to apply.';
      showToast({ message: msg, type: 'error' });
    } finally {
      setApplying(null);
    }
  };

  const renderFilter = ({ item }: { item: string }) => {
    const selected = activeFilter === item;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor: selected ? theme.Colors.primary : theme.Colors.surface,
            borderColor: selected ? theme.Colors.primary : theme.Colors.grey[200],
          },
        ]}
        activeOpacity={0.82}
        onPress={() => setActiveFilter(item)}
      >
        <ThemedText
          type="label"
          size="small"
          weight="800"
          color={selected ? '#fff' : theme.Colors.grey[500]}
        >
          {item}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }),
            }],
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="briefcase-outline" size={24} color={theme.Colors.primary} style={{ marginRight: 8 }} />
          <ThemedText type="headline" size="medium" weight="800">
            {t('common:available_jobs')}
          </ThemedText>
        </View>
        <View style={[styles.summaryBar, { backgroundColor: theme.Colors.primary + '10' }]}>
          <ThemedText type="label" size="small" weight="800" color={theme.Colors.primary}>
            {filteredJobs.length} matches
          </ThemedText>
          <ThemedText type="label" size="small" weight="700" color={theme.Colors.grey[500]}>
            Bid fast on nearby work
          </ThemedText>
        </View>
      </Animated.View>
 
      <FlatList
        data={FILTERS}
        renderItem={renderFilter}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterList}
      />
 
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={theme.Colors.primary} />
          <ThemedText type="label" size="small" color={theme.Colors.grey[500]} style={styles.loadingText}>
            Finding fresh work near you...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={({ item, index }) => (
            <AnimatedJobCard
              item={item}
              index={index}
              applying={applying === item.id}
              onApply={openBidModal}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={6}
          windowSize={8}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={42} color={theme.Colors.grey[400]} style={{ marginBottom: 14 }} />
              <ThemedText type="title" size="medium" weight="800">No jobs here yet</ThemedText>
              <ThemedText type="body" size="small" color={theme.Colors.grey[500]} style={styles.emptyCopy}>
                Try another category or check again soon.
              </ThemedText>
            </View>
          }
        />
      )}

      <Modal visible={isBidModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" size="medium" weight="800">Submit your bid</ThemedText>
            <ThemedText type="body" size="small" color={theme.Colors.grey[500]} style={styles.modalSubtitle}>
              {selectedJob?.title}
            </ThemedText>

            <ThemedText type="label" size="small" weight="800" style={styles.inputLabel}>Your Bid Amount (₹)</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: theme.Colors.grey[200], color: theme.md3.colors.onSurface }]}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={theme.Colors.grey[400]}
            />

            <ThemedText type="label" size="small" weight="800" style={styles.inputLabel}>Cover Letter</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: theme.Colors.grey[200], color: theme.md3.colors.onSurface }]}
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={3}
              placeholder="Tell the hirer why you are a good fit..."
              placeholderTextColor={theme.Colors.grey[400]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.Colors.grey[100] }]}
                onPress={() => setIsBidModalVisible(false)}
              >
                <ThemedText weight="800">Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.submitBtn, { backgroundColor: theme.Colors.primary }]}
                onPress={handleApply}
              >
                <ThemedText color="#fff" weight="800">Submit Bid</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14 },
  summaryBar: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterList: { flexGrow: 0 },
  filterContent: { paddingHorizontal: 20, paddingBottom: 14, gap: 8 },
  filterChip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 110, gap: 14 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12 },
  jobCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  jobTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 25 },
  jobInfo: { flex: 1, minWidth: 0 },
  payPill: {
    minWidth: 68,
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  payMeta: { fontSize: 9, fontWeight: '800', opacity: 0.72 },
  jobMetaRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  applyBtn: {
    marginTop: 16,
    minHeight: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyText: { color: '#fff', fontSize: 15 },
  applyTextHi: { color: 'rgba(255,255,255,0.74)', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.56)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  modalSubtitle: { marginTop: 4, marginBottom: 8 },
  inputLabel: { marginBottom: 8, marginTop: 16 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: { height: 104, paddingTop: 12, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', marginTop: 26 },
  modalBtn: { flex: 1, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  submitBtn: { marginLeft: 12 },
  emptyState: { alignItems: 'center', marginTop: 70, paddingHorizontal: 24 },
  emptyIcon: { fontSize: 42, marginBottom: 14 },
  emptyCopy: { marginTop: 8, textAlign: 'center' },
});

export default FindJobsScreen;
