import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemedText } from '../common/ThemedText';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

/**
 * Enhanced Message Bubble with larger text for readability,
 * read receipts (✓✓), and better visual hierarchy.
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  const { theme } = useTheme();
  const md3 = theme.md3.colors;

  return (
    <View style={[
      styles.container,
      isMe ? styles.meContainer : styles.otherContainer,
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isMe ? md3.primary : md3.surfaceVariant,
          borderBottomRightRadius: isMe ? 4 : 20,
          borderBottomLeftRadius: isMe ? 20 : 4,
        },
      ]}>
        <ThemedText
          style={{
            color: isMe ? md3.onPrimary : md3.onSurfaceVariant,
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          {message.text}
        </ThemedText>
        <View style={styles.metaRow}>
          <ThemedText
            size="small"
            style={{
              color: isMe ? md3.onPrimary + '80' : md3.onSurfaceVariant + '80',
              fontSize: 11,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </ThemedText>
          {isMe && (
            <ThemedText
              style={{
                color: md3.onPrimary + '80',
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              ✓✓
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  meContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
});

export default MessageBubble;
