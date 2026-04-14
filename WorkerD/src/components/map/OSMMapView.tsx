import React, { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

interface OSMMapViewProps {
    coordinates: LocationCoordinates;
    title?: string;
    description?: string;
    zoomEnabled?: boolean;
    scrollEnabled?: boolean;
    height?: number;
    editable?: boolean;
    onLocationSelect?: (latitude: number, longitude: number) => void;
}

/**
 * OSMMapView - A WebView-based OpenStreetMap component using Leaflet.js
 * This avoids Google Maps API dependency entirely.
 */
const OSMMapView: React.FC<OSMMapViewProps> = ({
    coordinates,
    title = 'Location',
    zoomEnabled = true,
    scrollEnabled = true,
    height = 200,
    editable = false,
    onLocationSelect,
}) => {
    const webViewRef = useRef<WebView>(null);

    const handleMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'locationSelected' && editable && onLocationSelect) {
                onLocationSelect(data.latitude, data.longitude);
            }
        } catch (e) {
            console.warn('OSMMapView message parse error:', e);
        }
    }, [editable, onLocationSelect]);

    const mapHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { 
            width: 100%; 
            height: 100%; 
            background: #f0f0f0;
        }
        .leaflet-control-attribution { display: none !important; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        try {
            var map = L.map('map', {
                zoomControl: ${zoomEnabled},
                scrollWheelZoom: ${scrollEnabled},
                dragging: ${scrollEnabled},
                touchZoom: ${zoomEnabled},
                doubleClickZoom: ${zoomEnabled},
            }).setView([${coordinates.latitude}, ${coordinates.longitude}], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            var marker = L.marker([${coordinates.latitude}, ${coordinates.longitude}], {
                draggable: ${editable}
            }).addTo(map);

            marker.bindPopup("${title.replace(/"/g, '\\"')}");

            ${editable ? `
            marker.on('dragend', function(e) {
                var pos = e.target.getLatLng();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: pos.lat,
                    longitude: pos.lng
                }));
            });

            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }));
            });
            ` : ''}
        } catch(e) {
            document.body.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Map loading...</div>';
        }
    </script>
</body>
</html>
    `;

    return (
        <View style={[styles.container, { height }]}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                style={styles.webview}
                scrollEnabled={false}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                scalesPageToFit={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                cacheEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default OSMMapView;
