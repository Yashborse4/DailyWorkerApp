import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NotificationService } from '../../services/NotificationService';
import { PushLogger } from '../../utils/Logger';
import { AnalyticsService } from '../../services/AnalyticsService';

export const PushNotificationListener: React.FC = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // 1. Listen for new messages while app is open (shows Notifee banner)
        const unsubscribeOnMessage = NotificationService.setupForegroundListener((message: any) => {
            // Callback to track received when app is in foreground
            AnalyticsService.trackNotificationReceived(message?.messageId, message?.data?.type);
        });

        // Helper to route user when they tap a notification
        const handleNotificationTap = (data: any) => {
            AnalyticsService.trackNotificationOpen(data?.messageId, data?.type, data?.route);
            if (data?.route) {
                // Navigate to the specified screen with params
                (navigation as any).navigate(data.route, data);
            }
        };

        // 2. Listen for taps on the Notifee banner while app is open
        const unsubscribeNotifee = NotificationService.setupNotifeeForegroundEvent(handleNotificationTap);

        // 3. Listen for taps on FCM notifications when app is in background
        const unsubscribeBackgroundTap = NotificationService.setupBackgroundTapListener(handleNotificationTap);

        // 4. Check if app was opened from a dead state via notification tap
        NotificationService.checkInitialNotification(handleNotificationTap);

        PushLogger.info('PushNotificationListener initialized with Notifee support');

        return () => {
            if (unsubscribeOnMessage) unsubscribeOnMessage();
            if (unsubscribeNotifee) unsubscribeNotifee();
            if (unsubscribeBackgroundTap) unsubscribeBackgroundTap();
        };
    }, [navigation]);

    return null; // This component handles side effects only
};
