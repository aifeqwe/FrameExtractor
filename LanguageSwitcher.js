import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { i18n, setI18nConfig } from './i18n';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fa', label: 'فارسی' },
];

const LanguageSwitcher = ({ onChange }) => {
  const [selected, setSelected] = useState(i18n.locale);

  const handleChange = (code) => {
    setSelected(code);
    setI18nConfig(code);
    if (onChange) onChange(code);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{i18n.t('language')}:</Text>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.button, selected === lang.code && styles.selected]}
          onPress={() => handleChange(lang.code)}
        >
          <Text style={styles.text}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', margin: 8 },
  label: { marginRight: 8 },
  button: { padding: 8, marginHorizontal: 4, borderRadius: 6, backgroundColor: '#eee' },
  selected: { backgroundColor: '#2196F3' },
  text: { color: '#222' },
});

export default LanguageSwitcher;
