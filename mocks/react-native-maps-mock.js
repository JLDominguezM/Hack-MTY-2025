// Mock para react-native-maps
import React from 'react';
import { View, Text } from 'react-native';

export const MapView = ({ children, style, ...props }) => (
  <View 
    {...props} 
    style={[
      { 
        backgroundColor: '#e8f4f8', 
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc'
      }, 
      style
    ]}
  >
    <Text style={{ color: '#666', fontSize: 16 }}>🗺️ Map (Web Mock)</Text>
    {children}
  </View>
);

export const Marker = ({ children, ...props }) => (
  <View {...props}>
    {children}
  </View>
);

export const Callout = ({ children, ...props }) => (
  <View {...props}>
    {children}
  </View>
);

export const Polygon = ({ children, ...props }) => (
  <View {...props}>
    {children}
  </View>
);

export const Polyline = ({ children, ...props }) => (
  <View {...props}>
    {children}
  </View>
);

export const Circle = ({ children, ...props }) => (
  <View {...props}>
    {children}
  </View>
);

export default MapView;