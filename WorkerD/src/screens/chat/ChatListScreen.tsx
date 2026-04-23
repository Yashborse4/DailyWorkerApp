import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../../components/common/ThemedView';
import { ThemedText } from '../../components/common/ThemedText';
import { ThemedCard } from '../../components/common/ThemedCard';
import { BilingualText } from '../../components/common/BilingualText';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../hooks/useTheme';
import { ChatRoom } from '../../types';

export const ChatListScreen = () => {
  const { rooms, setActiveRoomId } = useChat();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const renderRoom = ({ item }: { item: ChatRoom }) => (
    <ThemedCard
      style={styles.card}
      onPress={() => {
        setActiveRoomId(item.id);
        navigation.navigate('ChatRoom', { roomId: item.id });
      }}
    >
      <View style={styles.content}>
        {/* Avatar with online indicator */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.md3.colors.primaryContainer }]}>
            <ThemedText weight="700" style={{ color: theme.md3.colors.onPrimaryContainer, fontSize: 18 }}>
              {item.otherUserName.charAt(0)}
            </ThemedText>
          </View>
          {/* Online dot indicator */}
          <View style={[styles.onlineDot, { backgroundColor: theme.Colors.success, borderColor: theme.Colors.surface }]} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.header}>
            <ThemedText weight="700" size="medium">{item.otherUserName}</ThemedText>
            {item.lastMessage && (
              <ThemedText size="small" color={theme.md3.colors.onSurfaceVariant + '99'}>
                {new Date(item.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
            )}
          </View>
          <View style={styles.footer}>
            <ThemedText
              numberOfLines={1}
              style={{ flex: 1, opacity: 0.7 }}
              color={item.unreadCount > 0 ? theme.md3.colors.primary : undefined}
            >
              {item.lastMessage?.text || t('no_conversations')}
            </ThemedText>
            {item.unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.Colors.success }]}>
                <ThemedText size="small" weight="800" style={{ color: '#fff', fontSize: 11 }}>
                  {item.unreadCount}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </ThemedCard>
  );

  const EmptyState = () => (
    <View style={styles.empty}>
      <ThemedText style={{ fontSize: 64, marginBottom: 16 }}>💬</ThemedText>
      <BilingualText
        primary={t('no_conversations')}
        secondary="अभी कोई बातचीत नहीं"
        type="title"
        size="small"
        weight="600"
        align="center"
        color={theme.Colors.grey[400]}
      />
      <ThemedText
        type="body"
        size="small"
        color={theme.Colors.grey[400]}
        style={{ marginTop: 8, textAlign: 'center' }}
      >
        {t('start_chatting')} / नियोक्ताओं से बात शुरू करें
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <BilingualText
          primary={t('messages')}
          secondary="संदेश"
          type="headline"
          size="small"
          weight="800"
          icon="💬"
        />
      </View>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.Colors.grey[100] }]} />
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingHorizontal: 20, paddingTop: 56, marginBottom: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { marginBottom: 4, padding: 14 },
  content: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
  },
  textContainer: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  footer: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.4,
  },
  empty: { marginTop: 100, alignItems: 'center', paddingHorizontal: 40 },
});

export default ChatListScreen;
