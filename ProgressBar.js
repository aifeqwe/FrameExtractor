import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProgressBar({ progress = 0, rtl = false }) {
  const value = Math.max(0, Math.min(100, Number(progress) || 0));
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }} style={styles.track}>
    <View style={[styles.fill, { width: `${value}%` }]} />
    <Text style={[styles.label, rtl && styles.labelRtl]}>{Math.round(value)}%</Text>
  </View>;
}
const styles = StyleSheet.create({ labelRtl: { right: 'auto', left: 0 }, track: { height: 10, borderRadius: 99, backgroundColor: '#E8EAF2', overflow: 'hidden', justifyContent: 'center' }, fill: { height: '100%', borderRadius: 99, backgroundColor: '#17BFA4' }, label: { position: 'absolute', right: 0, top: -19, fontSize: 10, fontWeight: '800', color: '#737A8D' } });
