import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/UserApi';
import { useNotifications } from '../../components/ui/ToastManager';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { logout } = useAuth();
  const { showError, showSuccess } = useNotifications();
  
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText.toLowerCase() !== 'delete my account') {
      showError('Please type "delete my account" to confirm');
      return;
    }

    if (!password) {
      showError('Please enter your password to confirm account deletion');
      return;
    }

    setIsLoading(true);
    try {
      await userApi.deleteAccount();
      showSuccess('Account deleted successfully', 'Your account has been deactivated.');
      
      // Logout and redirect to login
      setTimeout(() => {
        logout();
      }, 1500);
      
      onClose();
    } catch (error: any) {
      showError('Failed to delete account', error.response?.data?.message || 'Please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmationText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Account</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Warning Icon */}
            <View style={[styles.warningIcon, { backgroundColor: colors.errorContainer }]}>
              <Ionicons name="warning-outline" size={32} color={colors.onError} />
            </View>

            {/* Warning Message */}
            <Text style={[styles.warningText, { color: colors.text }]}>
              This action cannot be undone. All your data will be permanently deleted.
            </Text>

            {/* Password Confirmation */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Enter your password:</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surfaceVariant,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              placeholder="Your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            {/* Confirmation Text */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
              Type "delete my account" to confirm:
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surfaceVariant,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              placeholder="delete my account"
              placeholderTextColor={colors.textSecondary}
              value={confirmationText}
              onChangeText={setConfirmationText}
              autoCapitalize="none"
            />

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  { 
                    backgroundColor: colors.error,
                    opacity: (password && confirmationText.toLowerCase() === 'delete my account') ? 1 : 0.5
                  }
                ]}
                onPress={handleDeleteAccount}
                disabled={!password || confirmationText.toLowerCase() !== 'delete my account' || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.onError} />
                ) : (
                  <Text style={[styles.deleteText, { color: colors.onError }]}>
                    Delete Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    alignItems: 'center',
  },
  warningIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccountModal;
