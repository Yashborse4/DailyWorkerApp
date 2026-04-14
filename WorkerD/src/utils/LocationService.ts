
import { Platform } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface GeocodingResult {
    city?: string;
    subAdminArea?: string;
    adminArea?: string;
    formattedAddress?: string;
    street?: string;
    subStreet?: string;
}

export type LocationSuccessCallback = (coords: LocationCoordinates) => void;
export type LocationErrorCallback = (error: string) => void;


class LocationService {
    /**
     * Request Location Permission
     */
    async requestLocationPermission(): Promise<boolean> {
        try {
            let status: PermissionStatus;

            if (Platform.OS === 'android') {
                status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            } else if (Platform.OS === 'ios') {
                status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            } else {
                return false;
            }

            return status === RESULTS.GRANTED;
        } catch (error) {
            console.error('Location permission error:', error);
            return false;
        }
    }

    /**
     * Check Location Permission Status
     */
    async checkLocationPermission(): Promise<boolean> {
        try {
            let status: PermissionStatus;

            if (Platform.OS === 'android') {
                status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            } else if (Platform.OS === 'ios') {
                status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            } else {
                return false;
            }

            return status === RESULTS.GRANTED;
        } catch (error) {
            console.error('Check permission error:', error);
            return false;
        }
    }

    /**
     * Get Current Location
     */
    getCurrentLocation(
        onSuccess: LocationSuccessCallback,
        onError: LocationErrorCallback
    ): void {
        this.requestLocationPermission().then((hasPermission) => {
            if (!hasPermission) {
                onError('Location permission denied');
                return;
            }

            Geolocation.getCurrentPosition(
                (position: GeoPosition) => {
                    const { latitude, longitude } = position.coords;
                    onSuccess({ latitude, longitude });
                },
                (error) => {
                    console.error('Location Error:', error);
                    let errorMessage = 'Failed to get location';

                    switch (error.code) {
                        case 1: errorMessage = 'Permission denied'; break;
                        case 2: errorMessage = 'Location unavailable'; break;
                        case 3: errorMessage = 'Location request timed out'; break;
                        default: errorMessage = error.message;
                    }

                    onError(errorMessage);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    forceRequestLocation: true,
                    showLocationDialog: true, // Android only
                }
            );
        });
    }

    /**
     * Get Address from Coordinates (Reverse Geocoding via Nominatim API)
     * Returns only city-level information as requested
     */
    async getAddressFromCoordinates(latitude: number, longitude: number): Promise<GeocodingResult | null> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                {
                    headers: {
                        'User-Agent': 'CarSellingApp/1.0',
                    },
                }
            );

            if (!response.ok) {
                console.warn('Nominatim API returned non-OK status:', response.status);
                return null;
            }

            const data = await response.json();
            const addr = data.address || {};

            // Extract city-level information (prioritized)
            const city = addr.city || addr.town || addr.village || addr.municipality || '';
            const subAdminArea = addr.county || addr.state_district || '';
            const adminArea = addr.state || '';
            const street = addr.road || addr.street || '';
            const subStreet = addr.suburb || addr.neighbourhood || addr.quarter || '';

            return {
                city,
                subAdminArea,
                adminArea,
                formattedAddress: data.display_name || city || subAdminArea || adminArea || 'Unknown Location',
                street,
                subStreet,
            };
        } catch (error) {
            console.error('Reverse Geocoding Failed:', error);
            return null;
        }
    }
}

export const locationService = new LocationService();

