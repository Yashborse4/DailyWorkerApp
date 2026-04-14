import React from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ServerDownBannerProps {
    visible: boolean;
}

export const ServerDownBanner: React.FC<ServerDownBannerProps> = ({ visible }) => {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.colors.errorContainer, paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) }
        ]}>
            <View style={styles.content}>
                <Ionicons name="warning-outline" size={20} color={theme.colors.error} style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Server Down
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                        We're experiencing technical difficulties. Some features may be unavailable.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 12,
        zIndex: 9999,
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        opacity: 0.9,
    },
});
