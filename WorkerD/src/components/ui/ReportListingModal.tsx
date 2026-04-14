import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';

export interface ReportListingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (reason: string, comments: string) => Promise<void>;
    carTitle?: string;
}

const REPORT_REASONS = [
    { id: 'FAKE_LISTING', label: 'Fake Listing / Fraud', icon: 'alert-circle-outline' },
    { id: 'WRONG_INFORMATION', label: 'Inaccurate Information', icon: 'information-circle-outline' },
    { id: 'STOLEN_VEHICLE', label: 'Suspected Stolen', icon: 'shield-alert-outline' },
    { id: 'PRICING_SCAM', label: 'Pricing Scam / Suspicious price', icon: 'cash-outline' },
    { id: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content/Photos', icon: 'image-outline' },
    { id: 'SPAM', label: 'Spam or Duplicate', icon: 'mail-unread-outline' },
    { id: 'OTHER', label: 'Other Reason', icon: 'ellipsis-horizontal-outline' },
];

const ReportListingModal: React.FC<ReportListingModalProps> = ({
    visible,
    onClose,
    onSubmit,
    carTitle,
}) => {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add theme support for premium feel
    const { theme, isDark } = useTheme();
    const { colors } = theme;

    const handleSubmit = async () => {
        if (!selectedReason) return;
        setIsSubmitting(true);
        try {
            await onSubmit(selectedReason, comments);
            handleReset();
        } catch (error) {
            // Error handled by parent via toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelectedReason(null);
        setComments('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.container}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                    >
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            {/* Header */}
                            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                                <View>
                                    <Text style={[styles.title, { color: colors.text }]}>Report Listing</Text>
                                    {carTitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{carTitle}</Text>}
                                </View>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                                <Text style={[styles.sectionHeader, { color: colors.text }]}>Why are you reporting this?</Text>

                                <View style={styles.reasonsGrid}>
                                    {REPORT_REASONS.map((reason) => {
                                        const isSelected = selectedReason === reason.id;
                                        return (
                                            <TouchableOpacity
                                                key={reason.id}
                                                style={[
                                                    styles.reasonItem,
                                                    { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' },
                                                    isSelected && { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EFF6FF' },
                                                ]}
                                                onPress={() => setSelectedReason(reason.id)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={reason.icon as any}
                                                    size={20}
                                                    color={isSelected ? colors.primary : colors.textSecondary}
                                                />
                                                <Text style={[
                                                    styles.reasonLabel,
                                                    { color: colors.textSecondary },
                                                    isSelected && { color: colors.primary, fontWeight: '600' },
                                                ]}>
                                                    {reason.label}
                                                </Text>
                                                {isSelected && (
                                                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <Text style={[styles.sectionHeader, { color: colors.text }]}>Additional Details (Optional)</Text>
                                <TextInput
                                    style={[
                                        styles.commentInput,
                                        {
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F7FAFC',
                                            color: colors.text,
                                            borderColor: colors.border
                                        }
                                    ]}
                                    placeholder="Provide more details to help our moderators..."
                                    placeholderTextColor={colors.textDisabled}
                                    multiline
                                    numberOfLines={4}
                                    value={comments}
                                    onChangeText={setComments}
                                />

                                <View style={[styles.safetyInfo, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#EDF2F7' }]}>
                                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                                        Our team will review this report within 24 hours. Your identity will remain confidential.
                                    </Text>
                                </View>
                            </ScrollView>

                            {/* Footer */}
                            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                                <TouchableOpacity
                                    style={[styles.cancelButton, { borderColor: colors.border }]}
                                    onPress={onClose}
                                    disabled={isSubmitting}
                                >
                                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        { backgroundColor: colors.error },
                                        (!selectedReason || isSubmitting) && { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#FEB2B2' },
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={!selectedReason || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <Text style={styles.submitText}>Submit Report</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxHeight: '85%',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a202c',
    },
    subtitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
    },
    closeButton: {
        padding: 5,
    },
    content: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 12,
        marginTop: 8,
    },
    reasonsGrid: {
        marginBottom: 16,
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 8,
        backgroundColor: '#F8FAFC',
    },
    reasonItemSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#EFF6FF',
    },
    reasonLabel: {
        flex: 1,
        fontSize: 15,
        color: '#4A5568',
        marginLeft: 12,
    },
    reasonLabelSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    commentInput: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#2D3748',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        height: 100,
        textAlignVertical: 'top',
    },
    safetyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        padding: 12,
        backgroundColor: '#EDF2F7',
        borderRadius: 8,
        marginBottom: 20,
    },
    safetyText: {
        flex: 1,
        fontSize: 12,
        color: '#4A5568',
        marginLeft: 8,
        lineHeight: 16,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#718096',
    },
    submitButton: {
        flex: 2,
        backgroundColor: '#E53E3E',
        padding: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#FEB2B2',
    },
    submitText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ReportListingModal;
