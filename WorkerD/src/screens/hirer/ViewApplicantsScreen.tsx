import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { useTheme } from '../../hooks/useTheme';
import { getApplicationsForJob, updateApplicationStatus, JobApplication } from '../../api/jobApplicationService';
import * as chatService from '../../api/chatService';
import { useToast } from '../../context/ToastContext';

export const ViewApplicantsScreen = () => {
  const route = useRoute<any>();
  const { jobId, jobTitle } = route.params;
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigation = useNavigation<any>();
  
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchApplicants = async () => {
    try {
      const data = await getApplicationsForJob(jobId);
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleChatWithWorker = async (workerId: number, workerName: string) => {
    setProcessingId(1); // Generic busy state
    try {
      const room = await chatService.getOrCreateRoom(workerId);
      navigation.navigate('ChatRoom', { 
        roomId: room.id, 
        otherUserName: workerName 
      });
    } catch (error) {
      showToast({ message: 'Failed to initiate chat.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (applicationId: number, status: JobApplication['status']) => {
    setProcessingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      showToast({ message: `Application ${status.toLowerCase()} successfully!`, type: 'success' });
      fetchApplicants(); // Refresh list
    } catch (error) {
      showToast({ message: 'Failed to update status.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }: { item: JobApplication }) => (
    <ThemedCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <ThemedText weight="800" color="#fff">{item.workerName.charAt(0)}</ThemedText>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ThemedText weight="700" size="medium">{item.workerName}</ThemedText>
          <ThemedText size="small" color={theme.Colors.grey[500]}>Bid: ₹{item.bidAmount}</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'PENDING' ? theme.Colors.warning + '20' : theme.Colors.success + '20' }]}>
          <ThemedText weight="700" size="small" color={item.status === 'PENDING' ? theme.Colors.warning : theme.Colors.success}>{item.status}</ThemedText>
        </View>
      </View>

      {/* Added Status update helper back since I accidentally replaced it */}
      {item.status === 'PENDING' && (
        <ThemedText style={{ display: 'none' }}>{/* Hidden placeholder to keep logic flow if needed */}</ThemedText>
      )}

      <ThemedText style={styles.coverLetter} size="small">{item.coverLetter || 'No cover letter provided.'}</ThemedText>

      {item.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionBtn, { borderColor: theme.Colors.error }]}
            onPress={() => handleStatusUpdate(item.id, 'REJECTED')}
            disabled={processingId === item.id}
          >
            <ThemedText color={theme.Colors.error} weight="700">Reject</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.primaryBtn, { backgroundColor: theme.Colors.hirer.base }]}
            onPress={() => handleStatusUpdate(item.id, 'ACCEPTED')}
            disabled={processingId === item.id}
          >
            {processingId === item.id ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemedText color="#fff" weight="700">Accept</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'ACCEPTED' && (
        <TouchableOpacity 
          style={[styles.chatBtn, { backgroundColor: theme.Colors.hirer.base }]}
          onPress={() => handleChatWithWorker(item.workerId, item.workerName)}
          disabled={processingId !== null}
        >
          {processingId === 1 ? (
             <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText color="#fff" weight="700">Chat with Worker</ThemedText>
          )}
        </TouchableOpacity>
      )}
    </ThemedCard>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="headline" size="medium">Applicants</ThemedText>
        <ThemedText type="body" color={theme.Colors.grey[500]}>{jobTitle}</ThemedText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.Colors.hirer.base} />
        </View>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText style={{ fontSize: 40 }}>👥</ThemedText>
              <ThemedText weight="700" style={{ marginTop: 16 }}>No applicants yet</ThemedText>
              <ThemedText color={theme.Colors.grey[500]}>Applications will appear here once workers apply.</ThemedText>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#555', justifyContent: 'center', alignItems: 'center' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  coverLetter: { marginBottom: 16, opacity: 0.8 },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  primaryBtn: { borderWidth: 0 },
  chatBtn: { height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 100 },
});

export default ViewApplicantsScreen;
