import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { BilingualText } from '../../components/common/BilingualText';
import { useTheme } from '../../hooks/useTheme';

/** Job category → icon + color mapping for visual recognition */
const JOB_ICONS: Record<string, { icon: string; color: string }> = {
  'Home Cleaning': { icon: '🧹', color: '#4CAF50' },
  'Electrical Repair': { icon: '🔌', color: '#FF9800' },
  'Construction Labour': { icon: '🏗️', color: '#F44336' },
  'Pest Control': { icon: '🪲', color: '#9C27B0' },
  'Warehouse Helper': { icon: '📦', color: '#2196F3' },
  'Delivery Partner': { icon: '🚴', color: '#00BCD4' },
  'Plumbing': { icon: '🔧', color: '#607D8B' },
  'Painting': { icon: '🎨', color: '#E91E63' },
};

/** Hindi translations for job titles */
const JOB_TITLES_HI: Record<string, string> = {
  'Home Cleaning': 'घर की सफ़ाई',
  'Electrical Repair': 'बिजली मरम्मत',
  'Construction Labour': 'निर्माण मजदूरी',
  'Pest Control': 'कीट नियंत्रण',
  'Warehouse Helper': 'गोदाम सहायक',
  'Delivery Partner': 'डिलीवरी पार्टनर',
  'Plumbing': 'प्लंबिंग',
  'Painting': 'पेंटिंग',
};

/** Difficulty type → color + Hindi mapping */
const TYPE_CONFIG: Record<string, { color: string; bg: string; hi: string }> = {
  Light: { color: '#2E7D32', bg: '#E8F5E9', hi: 'हल्का' },
  Skilled: { color: '#F57F17', bg: '#FFF8E1', hi: 'कुशल' },
  Heavy: { color: '#C62828', bg: '#FFEBEE', hi: 'भारी' },
  Unskilled: { color: '#1565C0', bg: '#E3F2FD', hi: 'सामान्य' },
};

import * as jobService from '../../api/jobService';
import * as jobApplicationService from '../../api/jobApplicationService';
import { ActivityIndicator, Alert } from 'react-native';
import { useToast } from '../../context/ToastContext';

export const FindJobsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [jobs, setJobs] = React.useState<jobService.Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [applying, setApplying] = React.useState<number | null>(null);
  const [isBidModalVisible, setIsBidModalVisible] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<jobService.Job | null>(null);
  const [bidAmount, setBidAmount] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('I am interested in this job.');

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    
    const finalBid = parseInt(bidAmount, 10);
    if (isNaN(finalBid) || finalBid <= 0) {
      Alert.alert('Invalid Bid', 'Please enter a valid amount.');
      return;
    }

    setApplying(selectedJob.id);
    setIsBidModalVisible(false);
    
    try {
      await jobApplicationService.applyForJob(selectedJob.id, {
        bidAmount: finalBid,
        coverLetter: coverLetter
      });
      showToast({ message: 'Applied successfully!', type: 'success' });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to apply.';
      showToast({ message: msg, type: 'error' });
    } finally {
      setApplying(null);
    }
  };

  const openBidModal = (job: jobService.Job) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
    setIsBidModalVisible(true);
  };

  const renderJobItem = ({ item }: { item: typeof MOCK_JOBS[0] }) => {
    const jobIcon = JOB_ICONS[item.title] || { icon: '🛠️', color: theme.Colors.primary };
    const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.Light;
    const titleHi = JOB_TITLES_HI[item.title] || '';

    if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </ThemedView>
    );
  }

  return (
      <ThemedCard style={styles.jobCard}>
        <View style={styles.jobRow}>
          {/* Large Job Icon — primary visual identifier */}
          <View style={[styles.jobIconBox, { backgroundColor: jobIcon.color + '15' }]}>
            <ThemedText style={styles.jobIconEmoji}>{jobIcon.icon}</ThemedText>
          </View>

          {/* Info Column */}
          <View style={styles.jobInfoCol}>
            {/* Bilingual Job Title */}
            <ThemedText type="title" size="medium" weight="700">
              {item.title}
            </ThemedText>
            {titleHi ? (
              <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                {titleHi}
              </ThemedText>
            ) : null}

            {/* Location + Type Row */}
            <View style={styles.metaRow}>
              <View style={styles.locationChip}>
                <ThemedText style={{ fontSize: 12 }}>📍</ThemedText>
                <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>
                  {item.area}
                </ThemedText>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
                <View style={[styles.typeDot, { backgroundColor: typeConfig.color }]} />
                <ThemedText type="label" size="small" weight="700" color={typeConfig.color}>
                  {item.type} / {typeConfig.hi}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Wage Badge — prominent */}
          <View style={[styles.wageBadge, { backgroundColor: '#E8F5E9' }]}>
            <ThemedText type="label" size="small" weight="800" color="#2E7D32">
              ₹{item.wage}
            </ThemedText>
            <ThemedText style={{ fontSize: 9, color: '#66BB6A' }}>/day</ThemedText>
          </View>
        </View>

        {/* Apply Button — bilingual, green, with icon */}
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: '#2E7D32' }]}
          activeOpacity={0.8}
          onPress={() => {}}
          accessibilityLabel={`Apply for ${item.title} job paying ${item.wage} rupees`}
        >
          <ThemedText style={{ fontSize: 18, marginRight: 8 }}>✅</ThemedText>
          <ThemedText weight="700" style={styles.applyBtnText}>
            {t('apply_now')}
          </ThemedText>
          <ThemedText weight="500" style={styles.applyBtnTextHi}>
            / आवेदन करें
          </ThemedText>
        </TouchableOpacity>
      </ThemedCard>
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Bilingual Header */}
      <BilingualText
        primary={t('available_jobs')}
        secondary="उपलब्ध काम"
        type="headline"
        size="medium"
        weight="800"
        icon="💼"
        style={styles.title}
      />

      <FlatList
        data={jobs}
        renderItem={({ item }) => {
          const jobIcon = JOB_ICONS[item.title] || { icon: '🛠️', color: theme.Colors.primary };
          const typeConfig = TYPE_CONFIG[item.category] || TYPE_CONFIG.Skilled;
          const titleHi = JOB_TITLES_HI[item.title] || '';

          return (
            <ThemedCard style={styles.jobCard}>
              <View style={styles.jobRow}>
                <View style={[styles.jobIconBox, { backgroundColor: jobIcon.color + '15' }]}>
                  <ThemedText style={styles.jobIconEmoji}>{jobIcon.icon}</ThemedText>
                </View>

                <View style={styles.jobInfoCol}>
                  <ThemedText type="title" size="medium" weight="700">
                    {item.title}
                  </ThemedText>
                  {titleHi ? (
                    <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
                      {titleHi}
                    </ThemedText>
                  ) : null}

                  <View style={styles.metaRow}>
                    <View style={styles.locationChip}>
                      <ThemedText style={{ fontSize: 12 }}>📍</ThemedText>
                      <ThemedText type="label" size="small" color={theme.Colors.grey[400]}>
                        {item.location}
                      </ThemedText>
                    </View>
                    <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
                      <View style={[styles.typeDot, { backgroundColor: typeConfig.color }]} />
                      <ThemedText type="label" size="small" weight="700" color={typeConfig.color}>
                        {item.category} / {typeConfig.hi}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={[styles.wageBadge, { backgroundColor: '#E8F5E9' }]}>
                  <ThemedText type="label" size="small" weight="800" color="#2E7D32">
                    ₹{item.budget}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 9, color: '#66BB6A' }}>/day</ThemedText>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: '#2E7D32' }]}
                activeOpacity={0.8}
                onPress={() => openBidModal(item)}
                disabled={applying === item.id}
              >
                {applying === item.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <ThemedText style={{ fontSize: 18, marginRight: 8 }}>✅</ThemedText>
                    <ThemedText weight="700" style={styles.applyBtnText}>
                      {t('apply_now')}
                    </ThemedText>
                    <ThemedText weight="500" style={styles.applyBtnTextHi}>
                      / आवेदन करें
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </ThemedCard>
          );
        }}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
      />

      {/* Bid Modal */}
      <Modal visible={isBidModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" size="medium" weight="800" style={{ marginBottom: 20 }}>Apply for Job</ThemedText>
            
            <ThemedText type="label" size="small" style={styles.inputLabel}>Your Bid Amount (₹)</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: theme.Colors.grey[200], color: theme.md3.colors.onSurface }]}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />

            <ThemedText type="label" size="small" style={styles.inputLabel}>Cover Letter</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: theme.Colors.grey[200], color: theme.md3.colors.onSurface }]}
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={3}
              placeholder="Tell the hirer why you are a good fit..."
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.Colors.grey[100] }]}
                onPress={() => setIsBidModalVisible(false)}
              >
                <ThemedText weight="700">Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: theme.Colors.primary, marginLeft: 12 }]}
                onPress={handleApply}
              >
                <ThemedText color="#fff" weight="700">Submit Bid</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginTop: 40, marginBottom: 20 },
  jobCard: { padding: 16, borderRadius: 24 },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  jobIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobIconEmoji: { fontSize: 28 },
  jobInfoCol: { flex: 1, gap: 2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wageBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 64,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  applyBtnTextHi: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  inputLabel: { marginBottom: 8, marginTop: 16 },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  modalButtons: { flexDirection: 'row', marginTop: 32 },
  modalBtn: { flex: 1, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});

export default FindJobsScreen;
