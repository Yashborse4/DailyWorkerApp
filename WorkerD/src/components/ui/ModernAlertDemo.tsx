import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ModernAlert, { AlertVariant } from './ModernAlert';
import { useTheme } from '../../theme';

const ModernAlertDemo = () => {
    const { theme, isDark } = useTheme();
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        variant: AlertVariant;
        showCancel?: boolean;
    }>({
        visible: false,
        title: '',
        message: '',
        variant: 'info',
        showCancel: true,
    });

    const showAlert = (variant: AlertVariant, title: string, message: string, showCancel: boolean = true) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            variant,
            showCancel,
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    const handleConfirm = () => {
        console.log('Confirmed!');
        hideAlert();
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.header, { color: theme.colors.text }]}>Modern Alert Demo</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.success }]}
                    onPress={() => showAlert('success', 'Success!', 'Operation completed successfully.')}
                >
                    <Text style={styles.btnText}>Success Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.error }]}
                    onPress={() => showAlert('error', 'Error Occurred', 'Something went wrong. Please try again.')}
                >
                    <Text style={styles.btnText}>Error Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.warning }]}
                    onPress={() => showAlert('warning', 'Warning', 'Are you sure you want to proceed? This cannot be undone.')}
                >
                    <Text style={styles.btnText}>Warning Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.info }]}
                    onPress={() => showAlert('info', 'Did you know?', 'You can swipe left to delete items in the list.', false)}
                >
                    <Text style={styles.btnText}>Info Alert (No Cancel)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={() => showAlert('question', 'Log Out?', 'Are you sure you want to log out of your account?')}
                >
                    <Text style={styles.btnText}>Question Alert</Text>
                </TouchableOpacity>
            </ScrollView>

            <ModernAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                variant={alertConfig.variant}
                showCancel={alertConfig.showCancel}
                onConfirm={handleConfirm}
                onCancel={hideAlert}
                confirmText="Confirm"
                cancelText="Cancel"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollContent: {
        gap: 12,
        alignItems: 'center',
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: 200,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    btnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ModernAlertDemo;
