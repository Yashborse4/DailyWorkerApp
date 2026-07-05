import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import { ThemedInput } from '../common/ThemedInput';
import { ThemedText } from '../common/ThemedText';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onMicPress?: () => void;
}

/**
 * Enhanced Chat Input with mic button for voice messages.
 * Designed for users who can't type — the mic button is always visible
 * and prominent, allowing voice-based communication.
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onMicPress }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.md3.colors.surface, borderTopColor: theme.md3.colors.outlineVariant, borderTopWidth: 1 }]}>
      <View style={styles.innerContainer}>
        {/* Mic button — always visible for illiterate users */}
        <TouchableOpacity
          onPress={onMicPress}
          style={[
            styles.micButton,
            { backgroundColor: theme.Colors.secondary + '20' },
          ]}
          activeOpacity={0.7}
          accessibilityLabel="Record voice message"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="mic-outline" size={20} color={theme.Colors.secondary} />
        </TouchableOpacity>

        <ThemedInput
          variant="filled"
          placeholder={t('common:type_message')}
          value={text}
          onChangeText={setText}
          containerStyle={styles.input}
          style={{ height: 48 }}
        />

        {/* Send button with clear enabled/disabled states */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!hasText}
          style={[
            styles.sendButton,
            {
              backgroundColor: hasText ? theme.Colors.success : theme.md3.colors.surfaceDisabled,
              opacity: hasText ? 1 : 0.5,
            },
          ]}
          accessibilityLabel="Send message"
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;
