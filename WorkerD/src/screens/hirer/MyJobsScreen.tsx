import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

type JobStatus = 'All' | 'Active' | 'Pending' | 'Closed';

interface JobPost {
  id: string;
  title: string;
  category: string;
  location: string;
  salary: string;
  date: string;
  startDate?: string;
  endDate?: string;
  apps: number;
  status: 'Active' | 'Pending' | 'Closed';
}

const MOCK_JOBS: JobPost[] = [
  { id: '1', title: 'Need 5 Carpenters', category: 'Construction', location: 'Andheri, Mumbai', salary: '₹800/day', date: '2 hours ago', apps: 12, status: 'Active', startDate: '28 Mar', endDate: '02 Apr' },
  { id: '2', title: 'Painter for Apartment', category: 'Cleaning', location: 'Bandra, Mumbai', salary: '₹600/day', date: 'Yesterday', apps: 8, status: 'Active', startDate: '27 Mar', endDate: '29 Mar' },
  { id: '3', title: 'Office Cleaning', category: 'Cleaning', location: 'Worli, Mumbai', salary: '₹500/day', date: '3 days ago', apps: 15, status: 'Closed', startDate: '20 Mar', endDate: '21 Mar' },
  { id: '4', title: 'Electrician for Shop', category: 'Electrical', location: 'Dadar, Mumbai', salary: '₹1000/day', date: '5 days ago', apps: 4, status: 'Pending', startDate: '01 Apr', endDate: '01 Apr' },
  { id: '5', title: 'Plumber for Society', category: 'Plumbing', location: 'Powai, Mumbai', salary: '₹700/day', date: '1 week ago', apps: 20, status: 'Active', startDate: '24 Mar', endDate: '26 Mar' },
];

const AnimatedJobCard = ({ item, index, theme }: { item: JobPost, index: number, theme: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.delay(index * 100).start(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ]).start();
    });
  }, []);

  const getStatusColor = (status: string, isBg = false) => {
    switch(status) {
      case 'Active': return isBg ? '#E8F5E9' : '#2E7D32';
      case 'Pending': return isBg ? '#FFF3E0' : '#E65100';
      case 'Closed': return isBg ? '#FFEBEE' : '#C62828';
      default: return isBg ? '#F5F5F5' : '#757575';
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ThemedCard style={styles.jobCard} elevation={2}>
        <View style={styles.jobHeader}>
          <View style={{ flex: 1 }}>
            <ThemedText type="title" size="small" weight="700">{item.title}</ThemedText>
            <ThemedText type="body" size="small" color={theme.Colors.grey[500]}>{item.category} • {item.location}</ThemedText>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(item.status, true) }
          ]}>
            <ThemedText type="label" size="small" weight="700" color={getStatusColor(item.status)}>
              {item.status}
            </ThemedText>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: theme.Colors.grey[100] }]} />
        
        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <ThemedText type="label" size="small" color={theme.Colors.grey[500]}>Budget</ThemedText>
            <ThemedText weight="700">{item.salary}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText type="label" size="small" color={theme.Colors.grey[500]}>Project Timeline</ThemedText>
            <ThemedText weight="700">{item.startDate} - {item.endDate}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText type="label" size="small" color={theme.Colors.grey[500]}>Applications</ThemedText>
            <ThemedText weight="700">{item.apps}</ThemedText>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <ThemedText color={theme.Colors.hirer.base} weight="700">Applicants</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryActionBtn, { backgroundColor: theme.Colors.hirer.base }]}>
            <ThemedText color="#fff" weight="700">Manage</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    </Animated.View>
  );
};

export const MyJobsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState<JobStatus>('All');
  
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const filteredJobs = MOCK_JOBS.filter(job => 
    activeFilter === 'All' ? true : job.status === activeFilter
  );

  const renderFilterItem = (status: JobStatus) => (
    <TouchableOpacity 
      style={[
        styles.filterChip, 
        activeFilter === status && { backgroundColor: theme.Colors.hirer.base }
      ]}
      onPress={() => setActiveFilter(status)}
    >
      <ThemedText 
        type="label" 
        size="small" 
        weight="700"
        color={activeFilter === status ? '#fff' : theme.Colors.grey[500]}
      >
        {status}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
        <ThemedText type="headline" size="medium" style={styles.headerTitle}>My Job Posts</ThemedText>
        <ThemedText type="body" color={theme.Colors.grey[500]}>Track and manage your active listings.</ThemedText>
      </Animated.View>

      <View style={styles.filtersContainer}>
        <FlatList 
          data={['All', 'Active', 'Pending', 'Closed'] as JobStatus[]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderFilterItem(item)}
          keyExtractor={item => item}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      <FlatList 
        data={filteredJobs}
        renderItem={({ item, index }) => <AnimatedJobCard item={item} index={index} theme={theme} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={{ fontSize: 40 }}>📝</ThemedText>
            <ThemedText type="title" size="small" style={{ marginTop: 16 }}>No jobs found</ThemedText>
            <ThemedText color={theme.Colors.grey[500]} style={{ marginTop: 8 }}>Try changing the filter or post a new job.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  headerTitle: { marginBottom: 4 },
  filtersContainer: { marginBottom: 16 },
  filtersContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee'
  },
  listContent: { padding: 16, paddingBottom: 100 },
  jobCard: { 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f5f5f5'
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10 },
  divider: { height: 1, width: '100%', marginVertical: 16 },
  jobDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 8 },
  detailItem: { flex: 1 },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { 
    flex: 1, 
    height: 48, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee'
  },
  primaryActionBtn: { borderWidth: 0 },
  emptyContainer: { alignItems: 'center', marginTop: 80 }
});

export default MyJobsScreen;
