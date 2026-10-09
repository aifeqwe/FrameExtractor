import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import { formatDuration } from './utils';
import { t } from './i18n';

const C = { ink: '#10152A', muted: '#737A8D', teal: '#17BFA4', purple: '#7568F3', line: '#E8EAF2', white: '#FFFFFF', pale: '#F5F6FB' };
export default function FrameRangeSelector({ language, video, videoUri, duration, onBack, onContinue }) {
  const rtl = language === 'fa';
  const actualDuration = Math.max(0.1, Number(duration || video?.duration || 0.1));
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(actualDuration);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [loadedDuration, setLoadedDuration] = useState(actualDuration);
  const player = useRef(null);
  useEffect(() => { setStart(0); setEnd(actualDuration); setLoadedDuration(actualDuration); setPosition(0); setPlaying(false); }, [videoUri, actualDuration]);
  const onLoad = data => { const d = Number(data?.duration); if (Number.isFinite(d) && d > 0) { setLoadedDuration(d); setEnd(old => old <= 0.1 ? d : Math.min(old, d)); } };
  const maxDuration = Math.max(0.1, loadedDuration || actualDuration);
  const valid = end > start && end - start >= 0.1;
  return <View style={styles.container}>
    <View style={[styles.heading, rtl && styles.rowReverse]}><View style={{ flex: 1 }}><Text style={styles.kicker}>{t('stepOf', language)} 02 / 03</Text><Text style={[styles.title, rtl && styles.textRtl]}>{t('rangeTitle', language)}</Text><Text style={[styles.subtitle, rtl && styles.textRtl]}>{t('rangeHint', language)}</Text></View><View style={styles.durationBadge}><Text style={styles.durationText}>{formatDuration(maxDuration)}</Text></View></View>
    <View style={styles.videoCard}>
      {videoUri ? <Video ref={player} source={{ uri: videoUri }} style={styles.video} paused={!playing} resizeMode="contain" onLoad={onLoad} onProgress={data => setPosition(data.currentTime)} onEnd={() => setPlaying(false)} /> : <View style={styles.videoPlaceholder}><Text>▶</Text></View>}
      <Pressable onPress={() => setPlaying(p => !p)} style={styles.playButton}><Text style={styles.playText}>{playing ? 'Ⅱ' : '▶'}</Text></Pressable>
      <View style={[styles.videoFooter, rtl && styles.rowReverse]}><Text style={styles.fileName} numberOfLines={1}>{video?.fileName || t('noVideo', language)}</Text><Text style={styles.position}>{formatDuration(position)}</Text></View>
    </View>
    <View style={styles.rangeCard}>
      <View style={[styles.rangeHeader, rtl && styles.rowReverse]}><Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('start', language)}</Text><Text style={styles.timeValue}>{formatDuration(start)}</Text></View>
      <Slider minimumValue={0} maximumValue={Math.max(0.1, end - 0.1)} value={Math.min(start, Math.max(0, end - 0.1))} onValueChange={v => setStart(Math.min(v, end - 0.1))} step={0.1} minimumTrackTintColor={C.teal} maximumTrackTintColor={C.line} thumbTintColor={C.ink} accessibilityLabel={t('start', language)} />
      <View style={[styles.rangeHeader, rtl && styles.rowReverse]}><Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('end', language)}</Text><Text style={styles.timeValue}>{formatDuration(end)}</Text></View>
      <Slider minimumValue={Math.min(maxDuration, start + 0.1)} maximumValue={maxDuration} value={Math.min(end, maxDuration)} onValueChange={v => setEnd(Math.max(v, start + 0.1))} step={0.1} minimumTrackTintColor={C.purple} maximumTrackTintColor={C.line} thumbTintColor={C.ink} accessibilityLabel={t('end', language)} />
      <View style={[styles.selectionSummary, rtl && styles.rowReverse]}><Text style={styles.summaryLabel}>{language === 'fa' ? 'مدت انتخاب‌شده' : 'Selected duration'}</Text><Text style={styles.summaryValue}>{formatDuration(Math.max(0, end - start))}</Text></View>
    </View>
    <View style={[styles.actions, rtl && styles.rowReverse]}><Pressable style={styles.secondary} onPress={onBack}><Text style={styles.secondaryText}>{t('back', language)}</Text></Pressable><Pressable disabled={!valid} style={[styles.primary, !valid && { opacity: 0.45 }]} onPress={() => { setPlaying(false); onContinue({ start, end }); }}><Text style={styles.primaryText}>{t('continue', language)}</Text><Text style={styles.primaryArrow}>→</Text></Pressable></View>
  </View>;
}
const styles = StyleSheet.create({ rowReverse: { flexDirection: 'row-reverse' }, textRtl: { textAlign: 'right' }, container: { width: '100%', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }, heading: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 }, kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: C.purple, marginBottom: 7 }, title: { fontSize: 25, fontWeight: '800', color: C.ink, textAlign: 'left' }, subtitle: { fontSize: 13, lineHeight: 20, color: C.muted, marginTop: 7 }, durationBadge: { backgroundColor: '#F0EEFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }, durationText: { fontSize: 12, fontWeight: '800', color: C.purple }, videoCard: { height: 220, borderRadius: 22, overflow: 'hidden', backgroundColor: '#0D1123', justifyContent: 'center' }, video: { width: '100%', height: '100%' }, videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' }, playButton: { position: 'absolute', alignSelf: 'center', width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(23,191,164,0.95)', alignItems: 'center', justifyContent: 'center' }, playText: { fontSize: 20, color: C.ink, fontWeight: '800' }, videoFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(8,12,25,0.78)', paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, fileName: { color: C.white, fontSize: 12, flex: 1, marginRight: 10 }, position: { color: '#A7F4E7', fontSize: 12, fontWeight: '700' }, rangeCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 18, marginTop: 16 }, rangeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }, sectionTitle: { fontSize: 13, fontWeight: '700', color: C.ink }, timeValue: { fontSize: 13, fontWeight: '800', color: C.purple, fontVariant: ['tabular-nums'] }, selectionSummary: { marginTop: 12, backgroundColor: C.pale, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, summaryLabel: { fontSize: 12, color: C.muted }, summaryValue: { fontSize: 14, fontWeight: '800', color: C.ink }, actions: { flexDirection: 'row', gap: 12, marginTop: 18 }, secondary: { flex: 1, minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, secondaryText: { fontSize: 14, fontWeight: '700', color: C.ink }, primary: { flex: 1.5, minHeight: 54, borderRadius: 16, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }, primaryText: { fontSize: 14, fontWeight: '700', color: C.white }, primaryArrow: { position: 'absolute', right: 18, color: C.teal, fontSize: 20 } });
