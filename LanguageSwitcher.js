import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export default function LanguageSwitcher({ language, onChange }) {
  return <View style={styles.wrap} accessibilityLabel="Language">
    <Text style={styles.label}>Aa</Text>
    {['en', 'fa'].map(code => <Pressable key={code} onPress={() => onChange(code)} style={[styles.item, language === code && styles.selected]}><Text style={[styles.text, language === code && styles.selectedText]}>{code === 'en' ? 'EN' : 'فا'}</Text></Pressable>)}
  </View>;
}
const styles = StyleSheet.create({ wrap: { flexDirection: 'row', alignItems: 'center', padding: 4, borderRadius: 14, backgroundColor: '#F1F2F8', gap: 3 }, label: { fontSize: 12, fontWeight: '800', color: '#737A8D', paddingHorizontal: 8 }, item: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10 }, selected: { backgroundColor: '#10152A' }, text: { fontSize: 11, fontWeight: '800', color: '#737A8D' }, selectedText: { color: '#FFFFFF' } });
