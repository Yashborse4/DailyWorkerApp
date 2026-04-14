import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';

interface EmptyMediaPlaceholderProps {
    height: number;
    title?: string;
    subtitle?: string;
}

export const EmptyMediaPlaceholder: React.FC<EmptyMediaPlaceholderProps> = ({
    height,
    title = "No Media Available",
    subtitle = "Photos usually appear within 24 hours"
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    return (
        <View style={[styles.container, { height, backgroundColor: colors.surfaceVariant }]}>
            <View style={styles.content}>
                <Ionicons name="image-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        opacity: 0.7,
    },
    title: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
    }
});
