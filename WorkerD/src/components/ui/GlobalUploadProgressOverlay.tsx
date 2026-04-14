import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, FlatList, ScrollView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUploadQueue, UploadTask } from '../../context/UploadQueueContext';
import { useTheme } from '../../theme';
import { getResponsiveSpacing, getResponsiveTypography, getResponsiveBorderRadius, scaleSize } from '../../utils/responsiveEnhanced';
import { BlurView } from '@react-native-community/blur';

const GlobalUploadProgressOverlay: React.FC = () => {
    const { uploads, retryUpload, cancelUpload, removeFromQueue } = useUploadQueue();
    const { theme, isDark } = useTheme();
    const { colors } = theme;

    // We only show the overlay if there are active uploads
    const activeTasks = Array.from(uploads.values()).filter(
        task => ['pending', 'validating', 'compressing', 'uploading', 'failed', 'partial'].includes(task.status)
    );

    const [isExpanded, setIsExpanded] = useState(false);
    const slideAnim = useState(new Animated.Value(100))[0];

    useEffect(() => {
        if (activeTasks.length > 0) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 40
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 200, // slide down off screen
                duration: 300,
                useNativeDriver: true,
            }).start();
            setIsExpanded(false);
        }
    }, [activeTasks.length]);

    if (activeTasks.length === 0) return null;

    const renderTaskBar = (task: UploadTask) => {
        const isError = task.status === 'failed' || task.status === 'partial';
        const isSuccess = task.status === 'completed';
        const inProgress = ['pending', 'validating', 'compressing', 'uploading'].includes(task.status);

        let iconName = 'cloud-upload';
        let iconColor = colors.primary;

        if (isError) {
            iconName = 'alert-circle';
            iconColor = colors.error || '#EF4444';
        } else if (isSuccess) {
            iconName = 'checkmark-circle';
            iconColor = colors.success || '#10B981';
        } else if (task.status === 'compressing') {
            iconName = 'construct-outline';
        }

        return (
            <View key={task.carId} style={[styles.taskContainer, { backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: colors.border }]}>
                <View style={styles.taskHeader}>
                    <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.taskTitle, { color: colors.text }]}>
                            {task.uploadType === 'CHAT' ? 'Sending Message...' : 'Uploading New Car...'}
                        </Text>
                        <Text style={[styles.taskSubtitle, { color: isError ? iconColor : colors.textSecondary }]}>
                            {task.error ? task.error : (task.currentAction || `Progress: ${Math.round(task.progress)}%`)}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    {isError && (
                        <TouchableOpacity style={styles.actionButton} onPress={() => retryUpload(task.carId)}>
                            <Ionicons name="refresh" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                    {(isError || isSuccess) && (
                        <TouchableOpacity style={styles.actionButton} onPress={() => removeFromQueue(task.carId)}>
                            <Ionicons name="close" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                {inProgress && (
                    <View style={[styles.progressBarContainer, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${Math.max(0, Math.min(100, task.progress))}%`,
                                    backgroundColor: colors.primary
                                }
                            ]}
                        />
                    </View>
                )}

                {/* Granular Completed Logs */}
                {isExpanded && task.completedUploads && Object.keys(task.completedUploads).length > 0 && (
                    <View style={styles.logsContainer}>
                        {Object.keys(task.completedUploads).map((index) => (
                            <View key={index} style={styles.logItem}>
                                <Ionicons name="checkmark" size={14} color={colors.success || '#10B981'} style={{ marginRight: 6 }} />
                                <Text style={[styles.logText, { color: colors.textSecondary }]}>
                                    Image {parseInt(index) + 1} uploaded successfully
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

            </View>
        );
    };

    return (
        <Animated.View
            style={[
                styles.overlayContainer,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.expandToggle}
            >
                <View style={[styles.pill, { backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: colors.border }]}>
                    <Text style={[styles.pillText, { color: colors.text }]}>
                        {activeTasks.length} Active Upload{activeTasks.length > 1 ? 's' : ''}
                    </Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-down' : 'chevron-up'}
                        size={16}
                        color={colors.textSecondary}
                        style={{ marginLeft: 6 }}
                    />
                </View>
            </TouchableOpacity>

            {(isExpanded || activeTasks.length === 1) && ( // Auto expand if only 1 task
                <View style={[
                    styles.dropdownContainer,
                    { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)' }
                ]}>
                    <ScrollView style={{ maxHeight: 300 }} bounces={false} showsVerticalScrollIndicator={false}>
                        {activeTasks.map(renderTaskBar)}
                    </ScrollView>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 90 : 70, // Above bottom tab bar
        left: 0,
        right: 0,
        paddingHorizontal: getResponsiveSpacing('md'),
        zIndex: 9999,
        alignItems: 'center',
    },
    expandToggle: {
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleSize(16),
        paddingVertical: scaleSize(8),
        borderRadius: 20,
        borderWidth: 1,
    },
    pillText: {
        fontSize: getResponsiveTypography('xs'),
        fontWeight: '600',
    },
    dropdownContainer: {
        width: '100%',
        borderRadius: getResponsiveBorderRadius('md'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    taskContainer: {
        borderBottomWidth: 1,
        padding: getResponsiveSpacing('md'),
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: getResponsiveTypography('sm'),
        fontWeight: '600',
        marginBottom: 2,
    },
    taskSubtitle: {
        fontSize: getResponsiveTypography('xs'),
    },
    actionButton: {
        padding: scaleSize(6),
        marginLeft: scaleSize(8),
    },
    progressBarContainer: {
        height: scaleSize(6),
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    logsContainer: {
        marginTop: getResponsiveSpacing('sm'),
        paddingTop: getResponsiveSpacing('sm'),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(150,150,150,0.2)',
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    logText: {
        fontSize: getResponsiveTypography('xs') * 0.9,
    },
});

export default GlobalUploadProgressOverlay;
