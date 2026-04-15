import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useTheme } from '../../hooks/useTheme';
import { getMyApplications, JobApplication } from '../../api/jobApplicationService';

export const MyApplicationsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'ACCEPTED': return theme.Colors.success;
      case 'REJECTED': return theme.Colors.error;
      case 'PENDING': return theme.Colors.warning;
      case 'WITHDRAWN': return theme.Colors.grey[500];
      default: return theme.Colors.primary;
    }
  };

  const renderItem = ({ item }: { item: JobApplication }) => (
    <ThemedCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText weight="700" size="medium">{item.jobTitle}</ThemedText>
          <ThemedText size="small" color={theme.Colors.grey[500]}>Applied on {new Date(item.createdAt).toLocaleDateString()}</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <ThemedText weight="700" size="small" color={getStatusColor(item.status)}>{item.status}</ThemedText>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <ThemedText size="small" color={theme.Colors.grey[500]}>Your Bid</ThemedText>
          <ThemedText weight="700">₹{item.bidAmount}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText size="small" color={theme.Colors.grey[500]}>Status</ThemedText>
          <ThemedText weight="700" color={getStatusColor(item.status)}>{item.status === 'PENDING' ? 'Waiting' : item.status}</ThemedText>
        </View>
      </View>

      {item.status === 'ACCEPTED' && (
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: theme.Colors.primary }]}
          onPress={() => navigation.navigate('ChatList')}
        >
          <ThemedText color="#fff" weight="700">Message Hirer</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedCard>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="headline" size="medium">My Applications</ThemedText>
        <ThemedText type="body" color={theme.Colors.grey[500]}>Track your job bids and offers.</ThemedText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText style={{ fontSize: 40 }}>📄</ThemedText>
              <ThemedText weight="700" style={{ marginTop: 16 }}>No applications yet</ThemedText>
              <ThemedText color={theme.Colors.grey[500]}>Start applying for jobs to see them here.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60 },
  list: { padding: 16, paddingBottom: 100 },
  card: { padding: 20, marginBottom: 16, borderRadius: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  details: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flex: 1 },
  actionBtn: { height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 100 },
});

export default MyApplicationsScreen;
