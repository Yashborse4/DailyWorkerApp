import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
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

const MOCK_JOBS = [
  { id: '1', title: 'Home Cleaning', area: 'Andheri West', areaHi: 'अंधेरी वेस्ट', wage: 500, type: 'Light' },
  { id: '2', title: 'Electrical Repair', area: 'Bandra East', areaHi: 'बांद्रा ईस्ट', wage: 800, type: 'Skilled' },
  { id: '3', title: 'Construction Labour', area: 'Dadar', areaHi: 'दादर', wage: 600, type: 'Heavy' },
  { id: '4', title: 'Pest Control', area: 'Juhu', areaHi: 'जुहू', wage: 750, type: 'Skilled' },
  { id: '5', title: 'Warehouse Helper', area: 'Bhiwandi', areaHi: 'भिवंडी', wage: 450, type: 'Unskilled' },
];

export const FindJobsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const renderJobItem = ({ item }: { item: typeof MOCK_JOBS[0] }) => {
    const jobIcon = JOB_ICONS[item.title] || { icon: '🛠️', color: theme.Colors.primary };
    const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.Light;
    const titleHi = JOB_TITLES_HI[item.title] || '';

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
        data={MOCK_JOBS}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
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
});

export default FindJobsScreen;
