import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { t } from './i18n';
import { formatDuration } from './utils';

const palette = { ink: '#10152A', muted: '#6D7488', teal: '#38E0C1', purple: '#8275FF', line: '#E8EAF2', white: '#FFFFFF', pale: '#F5F6FB' };

export default function VideoPicker({ language, onSelect, selectedVideo }) {
  const [busy, setBusy] = useState(false);
  const rtl = language === 'fa';
  const pick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await launchImageLibrary({ mediaType: 'video', selectionLimit: 1, includeExtra: false });
      if (result.didCancel) return;
      if (result.errorCode) throw new Error(result.errorMessage || result.errorCode);
      const asset = result.assets?.[0];
      if (!asset?.uri) throw new Error('Missing video URI');
      if (asset.type && !asset.type.startsWith('video/')) throw new Error('Please select a video file.');
      onSelect({ uri: asset.uri, fileName: asset.fileName || 'video', duration: Number(asset.duration) || 0, width: asset.width || 0, height: asset.height || 0, fileSize: asset.fileSize || 0 });
    } catch (error) {
      Alert.alert(t('errorTitle', language), t('pickerError', language));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.heroIcon}><Text style={styles.heroGlyph}>▶</Text><View style={styles.spark} /></View>
      <Text style={styles.eyebrow}>VIDEO → IMAGE</Text>
      <Text style={styles.title}>{t('intro', language)}</Text>
      <Text style={styles.subtitle}>{t('videoHint', language)}</Text>
      {selectedVideo ? <View style={[styles.selected, rtl && styles.rowReverse]}><Text style={styles.selectedGlyph}>✓</Text><View style={{ flex: 1 }}><Text style={styles.selectedName} numberOfLines={1}>{selectedVideo.fileName}</Text><Text style={styles.selectedMeta}>{formatDuration(selectedVideo.duration)} · {selectedVideo.width && selectedVideo.height ? `${selectedVideo.width} × ${selectedVideo.height}` : t('noVideo', language)}</Text></View></View> : null}
      <Pressable onPress={pick} disabled={busy} style={({ pressed }) => [styles.primary, rtl && styles.rowReverse, pressed && styles.pressed, busy && { opacity: 0.7 }]} accessibilityRole="button">
        <Text style={styles.primaryText}>{busy ? t('preparing', language) : t(selectedVideo ? 'chooseAnother' : 'chooseVideo', language)}</Text><Text style={[styles.arrow, rtl && styles.arrowRtl]}>↗</Text>
      </Pressable>
      <View style={[styles.privacy, rtl && styles.rowReverse]}><Text style={styles.lock}>⌑</Text><Text style={styles.privacyText}>{t('privateNote', language)}</Text></View>
    </View>
  );
}

export { formatDuration };

const styles = StyleSheet.create({ rowReverse: { flexDirection: 'row-reverse' }, arrowRtl: { right: 'auto', left: 20 }, wrap: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 22, paddingBottom: 28 }, heroIcon: { width: 112, height: 112, borderRadius: 32, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 26, shadowColor: '#4E59A8', shadowOpacity: 0.2, shadowRadius: 22, elevation: 7 }, heroGlyph: { color: palette.teal, fontSize: 42, marginLeft: 5 }, spark: { position: 'absolute', right: 17, top: 17, width: 10, height: 10, borderRadius: 5, backgroundColor: palette.purple }, eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2.8, color: '#7469E9', marginBottom: 13 }, title: { fontSize: 29, lineHeight: 38, fontWeight: '800', color: palette.ink, textAlign: 'center', maxWidth: 340 }, subtitle: { fontSize: 15, lineHeight: 24, color: palette.muted, textAlign: 'center', marginTop: 13, maxWidth: 320 }, primary: { marginTop: 28, width: '100%', minHeight: 60, backgroundColor: palette.ink, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20 }, pressed: { transform: [{ scale: 0.985 }], opacity: 0.92 }, primaryText: { fontSize: 16, fontWeight: '700', color: palette.white }, arrow: { position: 'absolute', right: 20, fontSize: 22, color: palette.teal }, privacy: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }, lock: { fontSize: 17, color: '#5D9F96' }, privacyText: { fontSize: 12, color: palette.muted }, selected: { width: '100%', marginTop: 22, padding: 14, borderRadius: 16, backgroundColor: '#F0FBF8', borderWidth: 1, borderColor: '#D1F5EA', flexDirection: 'row', alignItems: 'center', gap: 12 }, selectedGlyph: { fontSize: 20, color: '#168A70' }, selectedName: { fontSize: 14, fontWeight: '700', color: palette.ink }, selectedMeta: { fontSize: 12, color: palette.muted, marginTop: 4 } });
