import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Alert, View, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedInput } from '../../components/common/ThemedInput';
import { ThemedButton } from '../../components/common/ThemedButton';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';

const WORK_TYPES = ['Full-time', 'Part-time', 'One-off', 'Contract'];
const PAYMENT_MODES = ['Daily', 'Weekly', 'Fixed Price', 'Hourly'];
const ENTITY_TYPES = ['Company', 'Building Construction'];

export const PostJobScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState('');
  const [workType, setWorkType] = useState('One-off');
  const [paymentMode, setPaymentMode] = useState('Daily');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hiringEntity, setHiringEntity] = useState<'Company' | 'Building Construction'>('Company');
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigation = useNavigation<any>();

  // Animations
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(formFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(formSlideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ])
    ]).start();
  }, []);

  const handlePostJob = async () => {
    if (!title || !description || !location || !salary || !category) {
      return Alert.alert('Missing Fields', 'Please fill all essential fields to post a job.');
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
      showToast({ message: 'Job posted successfully!', type: 'success' });
      navigation.navigate('MyJobs');
    } catch (error) {
      showToast({ message: 'Failed to post job. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderChips = (options: string[], selected: string, onSelect: (val: string) => void) => (
    <View style={styles.chipContainer}>
      {options.map(option => (
        <TouchableOpacity 
          key={option}
          style={[
            styles.chip, 
            { borderColor: theme.Colors.grey[200] },
            selected === option && { backgroundColor: theme.Colors.hirer.base, borderColor: theme.Colors.hirer.base }
          ]}
          onPress={() => onSelect(option)}
        >
          <ThemedText 
            type="label" 
            size="small" 
            weight="700"
            color={selected === option ? '#fff' : theme.Colors.grey[500]}
          >
            {option}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.headerSection, { opacity: headerFadeAnim }]}>
          <ThemedText type="headline" size="medium" style={styles.header}>
            Post a New Job
          </ThemedText>
          <ThemedText type="body" style={styles.subHeader}>
            Help us find the right worker for you.
          </ThemedText>
        </Animated.View>

        <Animated.View style={{ opacity: formFadeAnim, transform: [{ translateY: formSlideAnim }] }}>
          <ThemedInput 
            label="Job Title" 
            placeholder="e.g. Electrician needed for home repair"
            value={title}
            onChangeText={setTitle}
          />
          
          <View style={styles.formGroup}>
            <ThemedText type="label" size="small" weight="700" style={styles.label}>Hiring Entity</ThemedText>
            {renderChips(ENTITY_TYPES, hiringEntity, (val) => setHiringEntity(val as any))}
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="label" size="small" weight="700" style={styles.label}>Work Type</ThemedText>
            {renderChips(WORK_TYPES, workType, setWorkType)}
          </View>

          <ThemedInput 
            label="Category" 
            placeholder="e.g. Construction, Cleaning, etc."
            value={category}
            onChangeText={setCategory}
          />

          <ThemedInput 
            label="Description" 
            placeholder="Describe the work in detail (e.g. tools required, specific tasks)..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <ThemedInput 
                label="Location" 
                placeholder="e.g. Andheri, Mumbai"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <ThemedInput 
                label="Est. Duration" 
                placeholder="e.g. 2 days"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <ThemedInput 
                label="Start Date" 
                placeholder="e.g. 28/03/2026"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <ThemedInput 
                label="End Date" 
                placeholder="e.g. 30/03/2026"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <ThemedText type="label" size="small" weight="700" style={styles.label}>Payment Frequency</ThemedText>
            {renderChips(PAYMENT_MODES, paymentMode, setPaymentMode)}
          </View>

          <ThemedInput 
            label="Salary / Budget" 
            placeholder="e.g. ₹500 - ₹1000"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <ThemedButton 
              title="Post Job Now" 
              loading={isLoading}
              onPress={handlePostJob}
              style={{ height: 56, borderRadius: 16 }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  headerSection: {
    marginBottom: 32,
  },
  header: {
    marginBottom: 8,
  },
  subHeader: {
    opacity: 0.6,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 12,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 60,
  }
});

export default PostJobScreen;
