import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../hooks/useTheme';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';

export const ChatRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { roomId } = route.params;
  const { activeRoom, setActiveRoomId, sendMessage } = useChat();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setActiveRoomId(roomId);
    return () => setActiveRoomId(null);
  }, [roomId]);

  useEffect(() => {
    if (activeRoom?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeRoom?.messages]);

  if (!activeRoom) return null;

  return (
    <ThemedView style={styles.container}>
      {/* Header — Fixed back button using text instead of broken Ionicons */}
      <View style={[styles.header, { borderBottomColor: theme.md3.colors.outlineVariant }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ThemedText style={{ fontSize: 22, color: theme.md3.colors.onSurface }}>←</ThemedText>
        </TouchableOpacity>

        <View style={[styles.avatar, { backgroundColor: theme.md3.colors.primaryContainer }]}>
          <ThemedText weight="800" style={{ color: theme.md3.colors.onPrimaryContainer }}>
            {activeRoom.otherUserName.charAt(0)}
          </ThemedText>
        </View>

        <View style={styles.headerInfo}>
          <ThemedText weight="700" size="medium">{activeRoom.otherUserName}</ThemedText>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: theme.Colors.success }]} />
            <ThemedText type="label" size="small" color={theme.Colors.success}>
              Online / ऑनलाइन
            </ThemedText>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={activeRoom.messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMe={item.senderId === 'user_id'}
          />
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ChatInput onSendMessage={(text) => sendMessage(roomId, text)} />
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messageList: { paddingVertical: 16 },
});

export default ChatRoomScreen;
