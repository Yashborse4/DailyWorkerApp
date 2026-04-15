import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useTheme } from '../../hooks/useTheme';
import * as jobService from '../../api/jobService';
import { ActivityIndicator } from 'react-native';

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
  status: 'PUBLISHED' | 'DRAFT' | 'COMPLETED' | 'CANCELLED';
}

// MOCK_JOBS removed

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
      case 'PUBLISHED': return isBg ? '#E8F5E9' : '#2E7D32';
      case 'DRAFT': return isBg ? '#FFF3E0' : '#E65100';
      case 'COMPLETED': return isBg ? '#E3F2FD' : '#1565C0';
      case 'CANCELLED': return isBg ? '#FFEBEE' : '#C62828';
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
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ViewApplicants', { jobId: item.id, jobTitle: item.title })}
          >
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
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const liveJobs = await jobService.getMyJobs();
      const mappedJobs: JobPost[] = liveJobs.map(j => ({
        id: j.id.toString(),
        title: j.title,
        category: j.category,
        location: j.location,
        salary: `₹${j.budget}`,
        date: new Date(j.createdAt).toLocaleDateString(),
        apps: 0, // Backend needs to provide this
        status: j.status as any
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    activeFilter === 'All' ? true : job.status === activeFilter
  );

  const renderFilterItem = (status: string) => (
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
          data={['All', 'PUBLISHED', 'DRAFT', 'COMPLETED', 'CANCELLED']}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderFilterItem(item)}
          keyExtractor={item => item}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.Colors.hirer.base} />
        </View>
      ) : (
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
      )}
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
